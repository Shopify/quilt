import {ApolloLink, Observable, Operation} from 'apollo-link';
import {
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  ExecutionResult,
  Location,
  GraphQLSchema,
  GraphQLError,
} from 'graphql';
import {compile, Field} from 'graphql-tool-utilities/ast';
import {GraphQLMock} from './types';

export default class MockApolloLink extends ApolloLink {
  constructor(private mock: GraphQLMock, private schema: GraphQLSchema) {
    super();
  }

  request(operation: Operation) {
    return new Observable(obs => {
      const {mock} = this;
      const {operationName = ''} = operation;
      const response =
        typeof mock === 'function'
          ? mock(operation)
          : mock[operationName || ''];

      let result: ExecutionResult | Error;

      if (response == null) {
        let message = `Can’t perform GraphQL operation '${operationName}' because no valid mocks were found`;

        if (typeof mock === 'object') {
          const operationNames = Object.keys(mock);
          // We will provide a more helpful message when it looks like they just provided data,
          // not an object mapping names to fixtures.
          const looksLikeDataNotFixtures = operationNames.every(
            name => name === name.toLowerCase(),
          );

          message += looksLikeDataNotFixtures
            ? ` (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, simply change your code to read 'mockGraphQLClient({${operationName}: yourFixture}).'`
            : ` (you provided an object that had mocks only for the following operations: ${Object.keys(
                mock,
              ).join(', ')}).`;
        } else {
          message +=
            ' (you provided a function that did not return a valid mock result)';
        }

        const error = new Error(message);
        result = error;
      } else if (response instanceof Error) {
        result = {errors: [new GraphQLError(response.message)]};
      } else {
        try {
          result = {
            data: normalizeGraphQLResponseWithOperation(
              response,
              operation,
              this.schema,
            ),
          };
        } catch (error) {
          result = error;
        }
      }

      obs.next(result);
      obs.complete();
    });
  }
}

export function normalizeGraphQLResponseWithOperation(
  data: {[key: string]: any},
  {query, operationName = ''}: Operation,
  schema: GraphQLSchema,
) {
  if (query == null || operationName == null) {
    return data;
  }

  // For some reason, these documents do not have any details on the source,
  // which apollo-codegen depends on for top-level operations. This manually
  // adds some hacky references so that they are always at least defined.
  query.definitions.forEach(definition => {
    (definition as any).loc =
      definition.loc || ({source: {name: 'GraphQL request'}} as Location);
  });

  const ast = compile(schema, query);
  const operation = ast.operations[operationName];

  return Object.keys(data).reduce(
    (all, key) => ({
      ...all,
      [key]: normalizeDataWithField(
        data[key],
        operation.fields &&
          operation.fields.find(({responseName}) => responseName === key),
      ),
    }),
    {},
  );
}

function normalizeDataWithField(data: any, field?: Field): any {
  if (data == null || typeof data !== 'object' || field == null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => normalizeDataWithField(item, field));
  }

  const finalType = rootType(field.type);

  if (
    !(finalType instanceof GraphQLObjectType) &&
    !(finalType instanceof GraphQLInterfaceType) &&
    !(finalType instanceof GraphQLUnionType)
  ) {
    throw new Error(
      `You provided an object fixture (${JSON.stringify(
        data,
      )}) for GraphQL type ${field.type.toString()}, which is not an object or interface type.`,
    );
  }

  return Object.keys(data).reduce(
    (all, key) => ({
      ...all,
      [key]: normalizeDataWithField(
        data[key],
        (field.fields || []).find(({responseName}) => responseName === key),
      ),
    }),
    {__typename: finalType.name},
  );
}

function rootType(type: GraphQLType) {
  let finalType = type;

  while (
    finalType instanceof GraphQLNonNull ||
    finalType instanceof GraphQLList
  ) {
    finalType = finalType.ofType;
  }

  return finalType;
}
