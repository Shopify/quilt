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
  GraphQLCompositeType,
} from 'graphql';
import {DocumentNode} from 'graphql-typed';
import {
  compile,
  Field,
  Operation,
  PrintableFieldDetails,
} from 'graphql-tool-utilities/ast';
import {randomFromArray, chooseNull} from './utilities';

export type Thunk<T> =
  | T
  | ((type: GraphQLType, parent: GraphQLObjectType) => T);

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

export type Resolver = (type: GraphQLType, parent: GraphQLObjectType) => any;

export interface Options {
  addTypename?: boolean;
  resolvers?: {[key: string]: Resolver};
}

interface Context {
  schema: GraphQLSchema;
  resolvers: Map<string, Resolver>;
  options: {addTypename: boolean};
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
  {resolvers: customResolvers = {}, addTypename = false}: Options = {},
) {
  const documentToOperation = new WeakMap<DocumentNode, Operation>();
  const resolvers = new Map(
    Object.entries({
      ...defaultResolvers,
      ...customResolvers,
    }),
  );

  const context = {schema, resolvers, options: {addTypename}};

  return function fill<Data, PartialData>(
    document: DocumentNode<Data, any, PartialData>,
    data?: DeepThunk<PartialData>,
  ): Data {
    let operation = documentToOperation.get(document);

    if (operation == null) {
      const ast = compile(schema, document);
      operation = Object.values(ast.operations)[0];
      documentToOperation.set(document, operation);
    }

    return fillObject(
      operation.rootType,
      operation.rootType,
      operation,
      data,
      context,
    ) as Data;
  };
}

function fillObject(
  type: GraphQLObjectType,
  parent: GraphQLObjectType,
  object: PrintableFieldDetails,
  partial: Thunk<{[key: string]: any}> | undefined,
  context: Context,
) {
  const {fields = []} = object;

  const starter = context.options.addTypename ? {__typename: type.name} : {};

  return fields.reduce<{[key: string]: any}>(
    (filledObject, field) => ({
      ...filledObject,
      [field.responseName]: fillType(
        field.type,
        field,
        valueForField(field.responseName, partial, type, parent, context),
        type,
        context,
      ),
    }),
    starter,
  );
}

function unwrapThunk<T>(
  value: Thunk<T>,
  type: GraphQLType,
  parent: GraphQLObjectType,
) {
  const unwrappedType = isNonNullType(type) ? type.ofType : type;
  return typeof value === 'function' ? value(unwrappedType, parent) : value;
}

function createValue<T>(
  partialValue: Thunk<any>,
  value: Thunk<T>,
  type: GraphQLType,
  parent: GraphQLObjectType,
) {
  if (partialValue !== undefined) {
    return unwrapThunk(partialValue, type, parent);
  }

  return isNonNullType(type) || !chooseNull()
    ? unwrapThunk(value, type, parent)
    : null;
}

function valueForField(
  fieldname: string,
  objectPartial: any,
  type: GraphQLCompositeType,
  parent: GraphQLObjectType,
  {resolvers}: Context,
) {
  const resolver = unwrapThunk<{[key: string]: any}>(
    resolvers.get(type.name) || {},
    type,
    parent,
  );
  const finalPartial = unwrapThunk(objectPartial || {}, type, parent);

  return unwrapThunk(
    finalPartial[fieldname] === undefined
      ? resolver[fieldname]
      : finalPartial[fieldname],
    type,
    parent,
  );
}

function fillForPrimitiveType(
  type: GraphQLScalarType | GraphQLEnumType,
  {resolvers}: Context,
) {
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
  field: Field,
  partial: Thunk<any>,
  parent: GraphQLObjectType,
  context: Context,
): any {
  const unwrappedType = isNonNullType(type) ? type.ofType : type;

  if (field.fieldName === '__typename') {
    return parent.name;
  } else if (isEnumType(unwrappedType) || isScalarType(unwrappedType)) {
    return createValue(
      partial,
      fillForPrimitiveType(unwrappedType, context),
      type,
      parent,
    );
  } else if (isListType(unwrappedType)) {
    const array = createValue(partial, () => [], type, parent);
    return array
      ? array.map((value: any) =>
          fillType(unwrappedType.ofType, field, value, parent, context),
        )
      : array;
  } else if (isAbstractType(unwrappedType)) {
    const possibleTypes = context.schema.getPossibleTypes(unwrappedType);
    const typename = valueForField(
      '__typename',
      partial,
      unwrappedType,
      parent,
      context,
    );

    const resolvedType = typename
      ? possibleTypes.find(({name}) => name === typename)
      : randomFromArray(context.schema.getPossibleTypes(unwrappedType));

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
        (field.inlineFragments && field.inlineFragments[resolvedType.name]) ||
          field,
        partial,
        context,
      );

    return createValue(partial ? filler : undefined, filler, type, parent);
  } else {
    // eslint-disable-next-line func-style
    const filler = () =>
      fillObject(unwrappedType, parent, field, partial, context);

    return createValue(partial ? filler : undefined, filler, type, parent);
  }
}

function randomEnumValue(enumType: GraphQLEnumType) {
  return randomFromArray(enumType.getValues()).value;
}

export function list<T = {}>(
  size: number | [number, number],
  partial?: Thunk<T>,
): Thunk<T>[] {
  const finalSize =
    typeof size === 'number' ? size : size[Math.round(Math.random())];
  return Array<T>(finalSize).fill(partial as any);
}
