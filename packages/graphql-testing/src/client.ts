// import {
//   ApolloClient,
//   SubscriptionOptions,
//   WatchQueryOptions,
//   ApolloClientOptions,
//   ObservableQuery,
// } from '@apollo/client';

import {ApolloClient, ApolloClientOptions} from '@apollo/client';

// type GetCurrentQueryResult = ApolloClient<
//   any
// >['queryManager']['getCurrentQueryResult'];

// type AnyFetchPolicy =
//   | SubscriptionOptions['fetchPolicy']
//   | WatchQueryOptions['fetchPolicy'];

// no-cache and network-only fetch policies cause an initial async event to be
// produced which is not properly caught inside of a react-testing act scope.
// const invalidFetchPolicies: AnyFetchPolicy[] = ['no-cache', 'network-only'];

// patch getCurrentQueryResult to protect against an initial observable event
export class TestingApolloClient<TCacheShape> extends ApolloClient<
  TCacheShape
> {
  // private readonly getCurrentQueryResult: GetCurrentQueryResult;

  constructor(options: ApolloClientOptions<TCacheShape>) {
    super(options);

    // this.getCurrentQueryResult = this.queryManager.getCurrentQueryResult.bind(
    //   this.queryManager,
    // );
    // this.queryManager.getCurrentQueryResult = this.getCurrentQueryResultSafe.bind(
    //   this,
    // );
  }

  // private getCurrentQueryResultSafe<T>(
  //   observableQuery: ObservableQuery<T>,
  //   optimistic?: boolean,
  // ) {
  //   const result = this.getCurrentQueryResult(observableQuery, optimistic);

  //   result.partial = isPartial(observableQuery, result);

  //   return result;
  // }
}

// detect the conditions where we need to override partial to true
// see https://github.com/apollographql/apollo-client/blob/413b41211a232911824e7ede62e41e2910ae1a25/packages/apollo-client/src/core/QueryManager.ts#L1036-L1038
// function isPartial(
//   observableQuery: ObservableQuery<any>,
//   {data, partial}: ReturnType<GetCurrentQueryResult>,
// ) {
//   if (
//     !observableQuery.getLastResult() &&
//     invalidFetchPolicies.includes(observableQuery.options.fetchPolicy) &&
//     data === undefined &&
//     partial === false
//   ) {
//     return true;
//   }

//   // if the conditions don't match we just return the original value
//   return partial;
// }
