import {
  ApolloClient,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  SubscriptionOptions,
  WatchQueryOptions,
} from 'apollo-client';
import {FetchResult, Observable} from 'apollo-link';

type AnyFetchPolicy =
  | MutationOptions['fetchPolicy']
  | QueryOptions['fetchPolicy']
  | SubscriptionOptions['fetchPolicy']
  | WatchQueryOptions['fetchPolicy'];

// no-cache and network-only fetch policies cause an initial async event to be
// produced which is not properly caught inside of a react-testing act scope.
const invalidFetchPolicies: AnyFetchPolicy[] = ['no-cache', 'network-only'];

// unset fetch policies that produce observable events after mounting so we
// don't run into issues with events firing outside of an act scope
function normalizeFetchPolicy<T extends AnyFetchPolicy>(
  fetchPolicy: T | undefined,
) {
  return !fetchPolicy || invalidFetchPolicies.includes(fetchPolicy)
    ? undefined
    : fetchPolicy;
}

// override mutate, query, subscribe, and watchQuery to normalize the
// fetchPolicy option before the call
export class TestingApolloClient<TCacheShape> extends ApolloClient<
  TCacheShape
> {
  mutate<T = any, TVariables = OperationVariables>({
    fetchPolicy,
    ...options
  }: MutationOptions<T, TVariables>): Promise<FetchResult<T>> {
    return super.mutate<T, TVariables>({
      ...options,
      fetchPolicy: normalizeFetchPolicy(fetchPolicy),
    });
  }

  query<T = any, TVariables = OperationVariables>({
    fetchPolicy,
    ...options
  }: QueryOptions<TVariables>) {
    return super.query<T, TVariables>({
      ...options,
      fetchPolicy: normalizeFetchPolicy(fetchPolicy),
    });
  }

  subscribe<T = any, TVariables = OperationVariables>({
    fetchPolicy,
    ...options
  }: SubscriptionOptions<TVariables>): Observable<FetchResult<T>> {
    return super.subscribe<T, TVariables>({
      ...options,
      fetchPolicy: normalizeFetchPolicy(fetchPolicy),
    });
  }

  watchQuery<T = any, TVariables = OperationVariables>({
    fetchPolicy,
    ...options
  }: WatchQueryOptions<TVariables>) {
    return super.watchQuery<T, TVariables>({
      ...options,
      fetchPolicy: normalizeFetchPolicy(fetchPolicy),
    });
  }
}
