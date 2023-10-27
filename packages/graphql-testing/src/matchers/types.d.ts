import type {GraphQLOperation} from 'graphql-typed';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T = {}> {
      toHavePerformedGraphQLOperation<Variables>(
        document: GraphQLOperation<any, Variables, any>,
        variables?: Partial<Variables>,
      ): void;
    }
  }
}
