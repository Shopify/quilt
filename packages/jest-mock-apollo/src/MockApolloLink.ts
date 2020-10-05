import {ApolloLink, Observable, Operation, NextLink} from 'apollo-link';
import {
  GraphQLType,
  ExecutionResult,
  Location,
  GraphQLSchema,
  GraphQLError,
  isListType,
  isInterfaceType,
  isObjectType,
  isNonNullType,
  isUnionType,
} from 'graphql';
import {compile, Field} from 'graphql-tool-utilities';

import {GraphQLMock, MockGraphQLFunction} from './types';

export default class MockApolloLink extends ApolloLink {
  constructor(private mock: GraphQLMock, private schema: GraphQLSchema) {
    super();
  }

  request(operation: Operation, _forward?: NextLink): Observable<any> {
    return new Observable(obs => {
      const {mock} = this;
      const {operationName = ''} = operation;

      let response: object | null = null;

      if (typeof mock === 'function') {
        response = mock(operation);
      } else {
        const mockForOperation = mock[operationName || ''];

        response =
          typeof mockForOperation === 'function'
            ? (mockForOperation as MockGraphQLFunction)(operation)
            : mockForOperation;
      }

      let result: ExecutionResult;

      if (response == null) {
        let message = `Can’t perform GraphQL operation '${operationName}' because no valid mocks were found`;

        if (typeof mock === 'object') {
          const operationNames = Object.keys(mock);

          if (operationNames.length === 0) {
            message += ' (it looks like you provided an empty mock object)';
          } else if (
            operationNames.every(name => name === name.toLowerCase())
          ) {
            // We will provide a more helpful message when it looks like they just provided data
            message += ` (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, simply change your code to read 'mockGraphQLClient({${operationName}: yourFixture})'`;
          } else {
            message += ` (you provided an object that had mocks only for the following operations: ${operationNames.join(
              ', ',
            )})`;
          }
        } else {
          message +=
            ' (you provided a function that did not return a valid mock result)';
        }

        // We want to throw this error and break the test since it's not coming from the user-defined mocks
        obs.error(new Error(message));
        obs.complete();
        return;
      } else if (response instanceof GraphQLError) {
        result = {errors: [response]};
      } else if (response instanceof Error) {
        result = {errors: [new GraphQLError(response.message)]};
      } else {
        // We want to throw any errors and break the test since it's not coming from the user-defined mocks
        try {
          result = {
            data: normalizeGraphQLResponseWithOperation(
              response,
              operation,
              this.schema,
            ),
          };
        } catch (error) {
          obs.error(error);
          obs.complete();
          return;
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
    isObjectType(finalType) &&
    isInterfaceType(finalType) &&
    isUnionType(finalType)
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

  while (isNonNullType(finalType) || isListType(finalType)) {
    finalType = finalType.ofType;
  }

  return finalType;
}
