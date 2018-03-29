import {ApolloClient} from 'apollo-client';
import {ApolloLink, Observable, GraphQLRequest, Operation} from 'apollo-link';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {readFileSync} from 'fs-extra';
import {
  buildSchema,
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLSchema,
  ExecutionResult,
  Location,
} from 'graphql';

import {compile, Field} from 'graphql-tool-utilities/ast';

export interface SchemaConfig {
  unionOrIntersectionTypes: any[];
  schemaBuildPath: string;
}

let unionOrIntersectionTypes: any[] = [];
let schemaBuildPath = '';

export function registerSchema(schema: SchemaConfig) {
  unionOrIntersectionTypes = schema.unionOrIntersectionTypes;
  schemaBuildPath = schema.schemaBuildPath;
}

export class FragmentMatcher extends IntrospectionFragmentMatcher {
  constructor() {
    super({
      introspectionQueryResultData: {
        __schema: {
          types: unionOrIntersectionTypes,
        },
      },
    });
  }
}

export type MockGraphQLResponse = Error | object;
export type GraphQLMock =
  | {[key: string]: MockGraphQLResponse}
  | ((request: GraphQLRequest) => MockGraphQLResponse);

export class MockApolloLink extends ApolloLink {
  constructor(private mock: GraphQLMock) {
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
        result = {errors: [response]};
      } else {
        try {
          result = {
            data: normalizeGraphQLResponseWithOperation(response, operation),
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

const getSchema = (() => {
  let schema: GraphQLSchema | undefined;

  return function getSchema() {
    if (schema == null) {
      schema = buildSchema(readFileSync(schemaBuildPath, 'utf8'));
    }

    return schema;
  };
})();

export function normalizeGraphQLResponseWithOperation(
  data: {[key: string]: any},
  {query, operationName = ''}: Operation,
) {
  if (query == null || operationName == null) {
    return data;
  }

  const schema = getSchema();

  // For some reason, these documents do not have any details on the source,
  // which apollo-codegen depends on for top-level operations. This manually
  // adds some hacky references so that they are always at least defined.
  query.definitions.forEach(definition => {
    definition.loc =
      definition.loc || ({source: {name: 'GraphQL'}} as Location);
  });

  const ast = compile(schema, query);
  const operation = ast.operations[operationName];

  return Object.keys(data).reduce(
    (all, key) => ({
      ...all,
      [key]: normalizeDataWithField(
        data[key],
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

function defaultGraphQLMock({operationName}: GraphQLRequest) {
  return new Error(
    `Can’t perform GraphQL operation '${operationName ||
      ''}' because no mocks were set.`,
  );
}

export type MockGraphQLClient = ApolloClient<any> & {
  graphQLRequests: Requests;
  graphQLResults: Promise<any>[];
};

export class Requests {
  private requests: GraphQLRequest[] = [];

  get last() {
    return this.requests[this.requests.length - 1];
  }

  [Symbol.iterator]() {
    return this.requests[Symbol.iterator]();
  }

  nth(index: number) {
    return index < 0
      ? this.requests[this.requests.length - index]
      : this.requests[index];
  }

  push(request: GraphQLRequest) {
    this.requests.push(request);
  }

  allOfOperation(): GraphQLRequest[] {
    return this.requests;
  }

  allWithOperationName(operation: string): GraphQLRequest[] {
    const allMatchedOperations = this.requests.filter(
      req => req.operationName === operation,
    );

    return allMatchedOperations;
  }

  lastOperation(operation: string): GraphQLRequest {
    const lastOperation = this.requests
      .reverse()
      .find(req => req.operationName === operation);

    if (lastOperation == null) {
      throw new Error(`no requests with operation '${operation}' were found.`);
    }

    return lastOperation;
  }
}

export function createGraphQLClient(
  mock: GraphQLMock = defaultGraphQLMock,
  {ssrMode = true} = {},
) {
  const cache = new InMemoryCache({
    fragmentMatcher: new FragmentMatcher(),
    // see https://github.com/apollographql/apollo-client/issues/2512
  }) as any;
  const mockLink = new MockApolloLink(mock);

  const graphQLRequests = new Requests();
  const graphQLResults: Promise<any>[] = [];
  const memoryLink = new ApolloLink((operation, forward) => {
    if (forward == null) {
      return null;
    }
    graphQLRequests.push(operation);
    let resolver: Function;
    graphQLResults.push(
      new Promise(resolve => {
        resolver = resolve;
      }),
    );
    const observer = forward(operation);
    observer.subscribe(next => resolver(next), err => resolver(err));
    return observer;
  });

  const client = new ApolloClient({
    link: memoryLink.concat(mockLink),
    cache,
    ssrMode,
  }) as MockGraphQLClient;

  client.graphQLRequests = graphQLRequests;
  client.graphQLResults = graphQLResults;

  return client;
}
