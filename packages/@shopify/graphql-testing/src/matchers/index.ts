import {GraphQLOperation} from 'graphql-typed';
import {toHavePerformedGraphQLOperation} from './operations';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePerformedGraphQLOperation<Variables>(
        document: GraphQLOperation<any, Variables, any>,
        variables?: Partial<Variables>,
      ): void;
    }
  }
}

expect.extend({
  toHavePerformedGraphQLOperation,
});
