import faker from 'faker';
import {
  GraphQLSchema,
  GraphQLType,
  isNonNullType,
  isEnumType,
  isListType,
  isAbstractType,
  GraphQLObjectType,
  GraphQLEnumType,
  isScalarType,
  GraphQLScalarType,
} from 'graphql';
import {DocumentNode, GraphQLOperation} from 'graphql-typed';
import {
  compile,
  Field,
  InlineFragment,
  Operation,
} from 'graphql-tool-utilities';
import {randomFromArray, chooseNull} from './utilities';

export interface FieldMetadata {
  fieldIndex?: number;
  fieldName: string;
  responseName: string;
}

export type FieldDetails = (Field | InlineFragment) & FieldMetadata;

export interface ResolveDetails {
  type: GraphQLType;
  parent: GraphQLObjectType;
  field: FieldDetails;
  parentFields: FieldDetails[];
}

export interface Resolver<T = any> {
  (details: ResolveDetails): T;
}

export type Thunk<T> = T | Resolver<T>;

export type DeepThunk<T> = {
  [P in keyof T]: Thunk<
    T[P] extends Array<infer U> | null | undefined
      ? Array<Thunk<DeepThunk<U>>> | null | undefined
      : T[P] extends ReadonlyArray<infer U> | null | undefined
        ? ReadonlyArray<Thunk<DeepThunk<U>>> | null | undefined
        : T[P] extends infer U | null | undefined
          ? (DeepThunk<U> | null | undefined)
          : T[P]
  >
};

export interface Options {
  resolvers?: {[key: string]: Resolver};
}

interface Context {
  schema: GraphQLSchema;
  resolvers: Map<string, Resolver>;
}

export interface GraphQLRequest<Data, Variables, PartialData> {
  query: DocumentNode<Data, Variables, PartialData>;
  variables?: Variables;
  operationName?: string;
}

const defaultResolvers = {
  String: () => faker.random.word(),
  Int: () => faker.random.number({precision: 1}),
  Float: () => faker.random.number({precision: 0.01}),
  Boolean: () => faker.random.boolean(),
  ID: () => faker.random.uuid(),
};

export function createFiller(
  schema: GraphQLSchema,
  {resolvers: customResolvers = {}}: Options = {},
) {
  const documentToOperation = new Map<string, Operation>();
  const resolvers = new Map(
    Object.entries({
      ...defaultResolvers,
      ...customResolvers,
    }),
  );

  const context = {schema, resolvers};

  return function fill<Data, Variables, PartialData>(
    _document: GraphQLOperation<Data, Variables, PartialData>,
    data?: DeepThunk<PartialData>,
  ): (request: GraphQLRequest<Data, Variables, PartialData>) => Data {
    return ({
      query,
      operationName,
    }: GraphQLRequest<Data, Variables, PartialData>) => {
      const operation =
        (operationName && documentToOperation.get(operationName)) ||
        Object.values(compile(schema, query).operations)[0];

      if (operationName != null) {
        documentToOperation.set(operationName, operation);
      }

      return fillObject(
        operation.rootType,
        operation.rootType,
        // the root type is kind of weird, since there is no "field" that
        // would be used in a resolver. For simplicity in the common case
        // we just hack this type to make it conform.
        [operation as any],
        data,
        context,
      ) as Data;
    };
  };
}

function fillObject(
  type: GraphQLObjectType,
  parent: GraphQLObjectType,
  parentFields: FieldDetails[],
  partial: Thunk<{[key: string]: any} | null> | undefined | null,
  context: Context,
) {
  const normalizedParentFields = [...parentFields];
  // We know there will always be at least one here, because the field for the object
  // itself is at the end.
  // eslint-disable-next-line typescript/no-non-null-assertion
  const ownField = normalizedParentFields.pop()!;
  const {fields = []} = ownField;

  const resolver = context.resolvers.get(type.name);
  const resolverObject =
    resolver &&
    unwrapThunk(resolver, {
      type,
      parent,
      field: ownField,
      parentFields: normalizedParentFields,
    });

  const partialObject =
    partial &&
    unwrapThunk(partial, {
      type,
      parent,
      field: ownField,
      parentFields: normalizedParentFields,
    });

  if (
    (resolverObject === null && !partialObject) ||
    (partialObject === null && !resolverObject)
  ) {
    return null;
  }

  return fields.reduce<{[key: string]: any}>((filledObject, field) => {
    const valueFromPartial = partialObject && partialObject[field.responseName];
    const valueFromResolver =
      resolverObject && resolverObject[field.responseName];
    const valueToUse =
      valueFromPartial === undefined ? valueFromResolver : valueFromPartial;

    return {
      ...filledObject,
      [field.responseName]: fillType(
        field.type,
        field,
        valueToUse &&
          unwrapThunk(valueToUse, {
            type,
            parent,
            field,
            parentFields: normalizedParentFields,
          }),
        type,
        ownField.hasOwnProperty('operationType') ? [] : parentFields,
        context,
      ),
    };
  }, {});
}

function isResolver<T>(value: Thunk<T>): value is Resolver<T> {
  return typeof value === 'function';
}

function unwrapThunk<T>(value: Thunk<T>, details: ResolveDetails): T {
  const {type} = details;
  const unwrappedType = isNonNullType(type) ? type.ofType : type;
  return isResolver(value) ? value({...details, type: unwrappedType}) : value;
}

function keyPathElement(responseName: string, fieldIndex: number | undefined) {
  return fieldIndex == null ? responseName : `${responseName}[${fieldIndex}]`;
}

// we need to set a seedOffset when filling fields that are indexed leafs in the
// graph, for indexed objects in the graph their key path will use the parent
// field index instead.
function withRandom<T>(keypath: FieldDetails[], func: () => T, seedOffset = 0) {
  faker.seed(
    seedFromKeypath(
      keypath.map(({fieldIndex, responseName}) =>
        keyPathElement(responseName, fieldIndex),
      ),
    ) + seedOffset,
  );
  const value = func();
  faker.seed(Math.random() * 10000);
  return value;
}

function createValue<T>(
  partialValue: Thunk<any>,
  value: Thunk<T>,
  details: ResolveDetails,
) {
  return withRandom(
    details.parentFields,
    () => {
      if (partialValue === undefined) {
        return isNonNullType(details.type) || !chooseNull()
          ? unwrapThunk(value, details)
          : null;
      } else {
        return unwrapThunk(partialValue, details);
      }
    },
    details.field.fieldIndex,
  );
}

function fillForPrimitiveType(
  type: GraphQLScalarType | GraphQLEnumType,
  {resolvers}: Context,
): Resolver {
  const resolver = resolvers.get(type.name);

  if (resolver) {
    return resolver;
  } else if (isEnumType(type)) {
    return () => randomEnumValue(type);
  } else {
    return () => faker.random.word();
  }
}

function fillType(
  type: GraphQLType,
  field: Field & FieldMetadata,
  partial: Thunk<any>,
  parent: GraphQLObjectType,
  parentFields: FieldDetails[],
  context: Context,
): any {
  const unwrappedType = isNonNullType(type) ? type.ofType : type;

  if (field.fieldName === '__typename') {
    return parent.name;
  } else if (isEnumType(unwrappedType) || isScalarType(unwrappedType)) {
    return createValue(partial, fillForPrimitiveType(unwrappedType, context), {
      type,
      field,
      parent,
      parentFields,
    });
  } else if (isListType(unwrappedType)) {
    const array = createValue(partial, () => [], {
      type,
      parent,
      field,
      parentFields,
    });
    return Array.isArray(array)
      ? array.map((value: any, fieldIndex) =>
          fillType(
            unwrappedType.ofType,
            {...field, fieldIndex},
            value,
            parent,
            parentFields,
            context,
          ),
        )
      : array;
  } else if (isAbstractType(unwrappedType)) {
    const possibleTypes = context.schema.getPossibleTypes(unwrappedType);

    const resolverObject = unwrapThunk<{[key: string]: any}>(
      context.resolvers.get(unwrappedType.name) || {},
      {
        type,
        parent,
        field,
        parentFields,
      },
    );

    const partialObject = unwrapThunk(partial || {}, {
      type,
      parent,
      field,
      parentFields,
    });

    const valueFromPartial = partialObject && partialObject.__typename;
    const valueFromResolver = resolverObject && resolverObject.__typename;

    const typename = unwrapThunk(
      valueFromPartial === undefined ? valueFromResolver : valueFromPartial,
      {
        type,
        parent,
        field,
        parentFields,
      },
    );

    const resolvedType = typename
      ? possibleTypes.find(({name}) => name === typename)
      : withRandom([...parentFields, field], () =>
          randomFromArray(context.schema.getPossibleTypes(unwrappedType)),
        );

    if (resolvedType == null) {
      throw new Error(
        `No type found for '${unwrappedType.name}'${
          typename
            ? ` (provided type '${typename}' does not exist or is not a possible type)`
            : ''
        }`,
      );
    }

    // eslint-disable-next-line func-style
    const filler = () =>
      fillObject(
        resolvedType,
        parent,
        [
          ...parentFields,
          {
            fieldName: field.fieldName,
            responseName: field.responseName,
            isConditional: field.isConditional,
            ...((field.inlineFragments &&
              field.inlineFragments[resolvedType.name]) ||
              field),
          },
        ],
        partial,
        context,
      );

    return createValue(partial === undefined ? undefined : filler, filler, {
      type,
      parent,
      field,
      parentFields,
    });
  } else {
    // eslint-disable-next-line func-style
    const filler = () =>
      fillObject(
        unwrappedType,
        parent,
        [...parentFields, field],
        partial,
        context,
      );

    return createValue(partial === undefined ? undefined : filler, filler, {
      type,
      parent,
      field,
      parentFields,
    });
  }
}

function randomEnumValue(enumType: GraphQLEnumType) {
  return randomFromArray(enumType.getValues()).value;
}

function seedFromKeypath(keypath: string[]) {
  return keypath.reduce<number>((sum, key) => sum + seedFromKey(key), 0);
}

function seedFromKey(key: string) {
  return [...key].reduce<number>(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
}

export function list<T = {}>(
  size: number | [number, number],
  partial?: Thunk<T>,
): Thunk<T>[] {
  const finalSize =
    typeof size === 'number' ? size : size[Math.round(Math.random())];
  return Array<Thunk<T>>(finalSize).fill(partial as Thunk<T>);
}
