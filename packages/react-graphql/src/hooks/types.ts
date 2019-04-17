import ApolloClient from 'apollo-client';
import {MutationOptions, FetchResult, OperationVariables} from 'react-apollo';

export interface MutationHookOptions<
  Data = any,
  Variables = OperationVariables
> extends MutationOptions<Data, Variables> {
  client?: ApolloClient<object>;
}

export type MutationHookResult<Data, Variables> = (
  options?: MutationOptions<Data, Variables>,
) => Promise<FetchResult<Data>>;
