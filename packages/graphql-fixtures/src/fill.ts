import {faker} from '@faker-js/faker/locale/en';
import type {
  GraphQLSchema,
  GraphQLType,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLScalarType,
} from 'graphql';
import {
  isNonNullType,
  isEnumType,
  isListType,
  isAbstractType,
  isScalarType,
  isInputObjectType,
} from 'graphql';
import type {DocumentNode, GraphQLOperation} from 'graphql-typed';
import type {IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import type {Field, Operation, InlineFragment} from 'graphql-tool-utilities';
import {compile} from 'graphql-tool-utilities';

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

export interface Resolver<Request, T = any> {
  (request: Request, details: ResolveDetails): T;
}

export type Thunk<Request, T> = T | Resolver<Request, T>;

export type DeepThunk<Request, T> =
  | (T extends object
      ? {
          [P in keyof T]: Thunk<
            Request,
            | (T[P] extends (infer U)[]
                ? Thunk<Request, DeepThunk<Request, U>>[]
                :
                    | (T[P] extends ReadonlyArray<infer U>
                        ? ReadonlyArray<Thunk<Request, DeepThunk<Request, U>>>
                        :
                            | (T[P] extends infer U
                                ? DeepThunk<Request, U>
                                : T[P])
                            | null
                            | undefined)
                    | null
                    | undefined)
            | null
            | undefined
          >;
        }
      : T)
  | null
  | undefined;
// The `undefined extends Variables ? {} : Variables` dance is needed to coerce
// variables that are undefined to an empty object, so that it matches the shape
// of `GraphQLOperation`, because that has a default value of `{}` on the
// variables generic type.
export type GraphQLFillerData<
  Operation extends GraphQLOperation,
  Request = undefined,
> =
  Operation extends GraphQLOperation<
    infer Data,
    infer Variables,
    infer PartialData
  >
    ? Thunk<
        undefined extends Request
          ? GraphQLRequest<
              Data,
              undefined extends Variables ? {} : Variables,
              PartialData
            >
          : Request,
        DeepThunk<
          undefined extends Request
            ? GraphQLRequest<
                Data,
                undefined extends Variables ? {} : Variables,
                PartialData
              >
            : Request,
          PartialData
        >
      >
    : never;

export interface Options<
  Request extends GraphQLRequest<any, any, any> | null = GraphQLRequest<
    any,
    any,
    any
  > | null,
> {
  resolvers?: {[key: string]: Resolver<Request>};
}

interface Context<Request extends GraphQLRequest<any, any, any> | null> {
  schema: GraphQLSchema;
  resolvers: Map<string, Resolver<Request>>;
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
  String: () => faker.word.sample(),
  Int: () =>
    faker.number.int({
      // GraphQL spec's max
      max: 2147483647,
    }),
  Float: () => faker.number.float({fractionDigits: 2}),
  Boolean: () => faker.datatype.boolean(),
  ID: () => faker.string.uuid(),
};

export function createFiller(
  schema: GraphQLSchema,
  {
    resolvers: customResolvers = {},
  }: Options<GraphQLRequest<any, any, any>> = {},
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
  ): (
    request: GraphQLRequest<
      Data,
      undefined extends Variables ? {} : Variables,
      PartialData
    >,
  ) => Data {
    return (
      request: GraphQLRequest<
        Data,
        undefined extends Variables ? {} : Variables,
        PartialData
      >,
    ) => {
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

export function createFillers(
  schema: GraphQLSchema,
  options: Options<GraphQLRequest<any, any, any> | null> = {},
) {
  const {resolvers: customResolvers = {}} = options;
  const resolvers = new Map(
    Object.entries({
      ...defaultResolvers,
      ...customResolvers,
    }),
  );

  const context = {schema, resolvers};

  return {
    fillFragment<Data extends {}, Variables extends {}, PartialData extends {}>(
      type: DocumentNode<Data, Variables, PartialData>,
      data?: GraphQLFillerData<GraphQLOperation<Data, Variables, PartialData>>,
    ): Data {
      const fragment = Object.values(
        compile(schema, normalizeDocument(type)).fragments,
      )[0];

      const randomTypeIndex = Math.floor(
        Math.random() * (fragment.possibleTypes.length - 1),
      );

      return fillObject(
        fragment.possibleTypes[randomTypeIndex],
        fragment.possibleTypes[randomTypeIndex],
        // the root type is kind of weird, since there is no "field" that
        // would be used in a resolver. For simplicity in the common case
        // we just hack this type to make it conform.
        [fragment as any],
        data,
        // Since we are filling a fragment outside of a query or mutation, there
        // is no concept of a request in this context.
        null,
        context,
      ) as Data;
    },
    fillOperation: createFiller(schema, options),
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

function fillObject<Request extends GraphQLRequest<any, any, any> | null>(
  type: GraphQLObjectType,
  parent: GraphQLObjectType,
  parentFields: FieldDetails[],
  partial: Thunk<Request, {[key: string]: any} | null> | undefined | null,
  request: Request,
  context: Context<Request>,
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
        Object.prototype.hasOwnProperty.call(ownField, 'operationType') ||
          Object.prototype.hasOwnProperty.call(ownField, 'fragmentName')
          ? []
          : parentFields,
        request,
        context,
      ),
    };
  }, {});
}

function isResolver<Request, T>(
  value: Thunk<Request, T>,
): value is Resolver<Request, T> {
  return typeof value === 'function';
}

function unwrapThunk<Request, T>(
  value: Thunk<Request, T>,
  request: Request,
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
function withRandom<Request, T>(
  request: Request,
  keypath: FieldDetails[],
  func: () => T,
  seedOffset = 0,
) {
  // The request null when we are filling a fragment using fillFragment.
  // In this case, we want random values for every fillFragment call.
  if (request != null) {
    faker.seed(
      seedFromKeypath(
        keypath.map(({fieldIndex, responseName}) =>
          keyPathElement(responseName, fieldIndex),
        ),
      ) + seedOffset,
    );
  }

  return func();
}

function createValue<Request, T>(
  partialValue: Thunk<Request, any>,
  value: Thunk<Request, T>,
  request: Request,
  details: ResolveDetails,
) {
  // If the partial fill value is a primitive type,
  // we can just return it directly and avoid reseeding the faker instance
  if (
    typeof partialValue === 'string' ||
    typeof partialValue === 'boolean' ||
    typeof partialValue === 'number'
  ) {
    return partialValue;
  }

  return withRandom(
    request,
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

function fillForPrimitiveType<
  Request extends GraphQLRequest<any, any, any> | null,
>(
  type: GraphQLScalarType | GraphQLEnumType,
  {resolvers}: Context<Request>,
): Resolver<Request> {
  const resolver = resolvers.get(type.name);

  if (resolver) {
    return resolver;
  } else if (isEnumType(type)) {
    return () => randomEnumValue(type);
  } else {
    return () => faker.word.sample();
  }
}

function fillType<Request extends GraphQLRequest<any, any, any> | null>(
  type: GraphQLType,
  field: Field & FieldMetadata,
  partial: Thunk<Request, any>,
  parent: GraphQLObjectType,
  parentFields: FieldDetails[],
  request: Request,
  context: Context<Request>,
): any {
  const unwrappedType = isNonNullType(type) ? type.ofType : type;

  if (field.fieldName === '__typename') {
    return parent.name;
  } else if (isInputObjectType(unwrappedType)) {
    // We almost certainly won't ever have to deal with an InputObjectType.
    // This is mostly here to keep typescript happy
    return unwrappedType.name;
  } else if (isEnumType(unwrappedType) || isScalarType(unwrappedType)) {
    return createValue(
      partial,
      fillForPrimitiveType<Request>(unwrappedType, context),
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

    const resolverObject = unwrapThunk<Request, {[key: string]: any}>(
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
      : withRandom(request, [...parentFields, field], () =>
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

export function list<Request, T = {}>(
  size: number | [number, number],
  partial?: Thunk<Request, T>,
): Thunk<Request, T>[] {
  const randomSize = ([min, max]: number[]) =>
    Math.round(Math.random() * (max - min) + min);
  const finalSize = typeof size === 'number' ? size : randomSize(size);
  return Array<Thunk<Request, T>>(finalSize).fill(partial as Thunk<Request, T>);
}
