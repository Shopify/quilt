import {faker} from '@faker-js/faker/locale/en';
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
import {IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import {
  compile,
  Field,
  InlineFragment,
  Operation,
} from 'graphql-tool-utilities';

import {randomFromArray, chooseNull} from './utilities';

// Re-export faker so that the exact version can be used by consumers
export {faker};
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

export interface Resolver<
  T = any,
  Data = {},
  Variables = {},
  DeepPartial = {},
> {
  (
    request: GraphQLRequest<Data, Variables, DeepPartial>,
    details: ResolveDetails,
  ): T;
}

export type Thunk<T, Data, Variables, DeepPartial> =
  | T
  | Resolver<T, Data, Variables, DeepPartial>;

export type DeepThunk<T, Data, Variables, DeepPartial> =
  | (T extends object
      ? {
          [P in keyof T]: Thunk<
            | (T[P] extends (infer U)[]
                ? Thunk<
                    DeepThunk<U, Data, Variables, DeepPartial>,
                    Data,
                    Variables,
                    DeepPartial
                  >[]
                :
                    | (T[P] extends ReadonlyArray<infer U>
                        ? ReadonlyArray<
                            Thunk<
                              DeepThunk<U, Data, Variables, DeepPartial>,
                              Data,
                              Variables,
                              DeepPartial
                            >
                          >
                        :
                            | (T[P] extends infer U
                                ? DeepThunk<U, Data, Variables, DeepPartial>
                                : T[P])
                            | null
                            | undefined)
                    | null
                    | undefined)
            | null
            | undefined,
            Data,
            Variables,
            DeepPartial
          >;
        }
      : T)
  | null
  | undefined;

export type GraphQLFillerData<Operation extends GraphQLOperation> =
  Operation extends GraphQLOperation<
    infer Data,
    infer Variables,
    infer PartialData
  >
    ? Thunk<
        DeepThunk<PartialData, Data, Variables, PartialData>,
        Data,
        Variables,
        PartialData
      >
    : never;

export interface Options {
  resolvers?: {[key: string]: Resolver};
}

interface Context {
  schema: GraphQLSchema;
  resolvers: Map<string, Resolver>;
}

export type GraphQLRequest<Data, Variables, PartialData> = {
  query: DocumentNode<Data, Variables, PartialData>;
  operationName?: string;
} & IfEmptyObject<
  Variables,
  {variables?: never},
  IfAllNullableKeys<Variables, {variables?: Variables}, {variables: Variables}>
>;

const defaultResolvers = {
  String: () => faker.random.word(),
  Int: () => faker.datatype.number({precision: 1}),
  Float: () => faker.datatype.number({precision: 0.01}),
  Boolean: () => faker.datatype.boolean(),
  ID: () => faker.datatype.uuid(),
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

  return function fill<
    Data extends {},
    Variables extends {},
    PartialData extends {},
  >(
    _document: GraphQLOperation<Data, Variables, PartialData>,
    data?: GraphQLFillerData<GraphQLOperation<Data, Variables, PartialData>>,
  ): (request: GraphQLRequest<Data, Variables, PartialData>) => Data {
    return (request: GraphQLRequest<Data, Variables, PartialData>) => {
      const {operationName, query} = request;

      const operation =
        (operationName && documentToOperation.get(operationName)) ||
        Object.values(compile(schema, normalizeDocument(query)).operations)[0];

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
        request,
        context,
      ) as Data;
    };
  };
}

// The documents that come from tools like Apollo do not have all
// the details that Apollo’s codegen utilities expect. In particular,
// they do not include the necessary `loc` information on the top-level
// definitions of the document. This code normalizes those issues by
// propagating the `loc` from the query to the definitions, which is
// usually totally fine since we stick to one operation per document.
function normalizeDocument(document: DocumentNode<any, any, any>) {
  return {
    ...document,
    definitions: document.definitions.map((definition) => ({
      ...definition,
      loc: definition.loc || document.loc,
    })),
  };
}

function fillObject(
  type: GraphQLObjectType,
  parent: GraphQLObjectType,
  parentFields: FieldDetails[],
  partial: Thunk<{[key: string]: any} | null, any, any, any> | undefined | null,
  request: GraphQLRequest<any, any, any>,
  context: Context,
) {
  const normalizedParentFields = [...parentFields];
  // We know there will always be at least one here, because the field for the object
  // itself is at the end.
  const ownField = normalizedParentFields.pop()!;
  const {fields = []} = ownField;

  const resolver = context.resolvers.get(type.name);
  const resolverObject =
    resolver &&
    unwrapThunk(resolver, request, {
      type,
      parent,
      field: ownField,
      parentFields: normalizedParentFields,
    });

  const partialObject =
    partial &&
    unwrapThunk(partial, request, {
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
          unwrapThunk(valueToUse, request, {
            type,
            parent,
            field,
            parentFields: normalizedParentFields,
          }),
        type,
        Object.prototype.hasOwnProperty.call(ownField, 'operationType')
          ? []
          : parentFields,
        request,
        context,
      ),
    };
  }, {});
}

function isResolver<T>(
  value: Thunk<T, any, any, any>,
): value is Resolver<T, any, any, any> {
  return typeof value === 'function';
}

function unwrapThunk<T>(
  value: Thunk<T, any, any, any>,
  request: GraphQLRequest<any, any, any>,
  details: ResolveDetails,
): T {
  const {type} = details;
  const unwrappedType = isNonNullType(type) ? type.ofType : type;
  return isResolver(value)
    ? value(request, {...details, type: unwrappedType})
    : value;
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
  return func();
}

function createValue<T>(
  partialValue: Thunk<any, any, any, any>,
  value: Thunk<T, any, any, any>,
  request: GraphQLRequest<any, any, any>,
  details: ResolveDetails,
) {
  return withRandom(
    details.parentFields,
    () => {
      if (partialValue === undefined) {
        return isNonNullType(details.type) || !chooseNull()
          ? unwrapThunk(value, request, details)
          : null;
      } else {
        return unwrapThunk(partialValue, request, details);
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

function fillType<Data, Variables, DeepPartial>(
  type: GraphQLType,
  field: Field & FieldMetadata,
  partial: Thunk<any, Data, Variables, DeepPartial>,
  parent: GraphQLObjectType,
  parentFields: FieldDetails[],
  request: GraphQLRequest<any, any, any>,
  context: Context,
): any {
  const unwrappedType = isNonNullType(type) ? type.ofType : type;

  if (field.fieldName === '__typename') {
    return parent.name;
  } else if (isEnumType(unwrappedType) || isScalarType(unwrappedType)) {
    return createValue(
      partial,
      fillForPrimitiveType(unwrappedType, context),
      request,
      {
        type,
        field,
        parent,
        parentFields,
      },
    );
  } else if (isListType(unwrappedType)) {
    const array = createValue(partial, () => [], request, {
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
            request,
            context,
          ),
        )
      : array;
  } else if (isAbstractType(unwrappedType)) {
    const possibleTypes = context.schema.getPossibleTypes(unwrappedType);

    const resolverObject = unwrapThunk<{[key: string]: any}>(
      context.resolvers.get(unwrappedType.name) || {},
      request,
      {
        type,
        parent,
        field,
        parentFields,
      },
    );

    const partialObject = unwrapThunk(partial || {}, request, {
      type,
      parent,
      field,
      parentFields,
    });

    const valueFromPartial = partialObject && partialObject.__typename;
    const valueFromResolver = resolverObject && resolverObject.__typename;

    const typename = unwrapThunk(
      valueFromPartial === undefined ? valueFromResolver : valueFromPartial,
      request,
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
        request,
        context,
      );

    return createValue(
      partial === undefined ? undefined : filler,
      filler,
      request,
      {
        type,
        parent,
        field,
        parentFields,
      },
    );
  } else {
    const filler = () =>
      fillObject(
        unwrappedType,
        parent,
        [...parentFields, field],
        partial,
        request,
        context,
      );

    return createValue(
      partial === undefined ? undefined : filler,
      filler,
      request,
      {
        type,
        parent,
        field,
        parentFields,
      },
    );
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

export function list<T = {}, Data = {}, Variables = {}, DeepPartial = {}>(
  size: number | [number, number],
  partial?: Thunk<T, Data, Variables, DeepPartial>,
): Thunk<T, Data, Variables, DeepPartial>[] {
  const randomSize = ([min, max]: number[]) =>
    Math.round(Math.random() * (max - min) + min);
  const finalSize = typeof size === 'number' ? size : randomSize(size);
  return Array<Thunk<T, Data, Variables, DeepPartial>>(finalSize).fill(
    partial as Thunk<T, Data, Variables, DeepPartial>,
  );
}
