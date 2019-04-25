import {OperationVariables} from 'apollo-client';
import {MutationOptions} from 'react-apollo';
import {DocumentNode} from 'graphql-typed';
import {useCallback} from 'react';

import {MutationHookOptions, MutationHookResult} from './types';
import useApolloClient from './apollo-client';

export default function useMutation<Data = any, Variables = OperationVariables>(
  mutation: DocumentNode<Data, Variables>,
  options: MutationHookOptions<Data, Variables> = {},
): MutationHookResult<Data, Variables> {
  const {
    client: overrideClient,
    variables,
    optimisticResponse,
    refetchQueries,
    awaitRefetchQueries,
    update,
    context,
    fetchPolicy,
  } = options;

  const client = useApolloClient(overrideClient);

  const runMutation = useCallback(
    (perMutationOptions: MutationOptions<Data, Variables> = {}) => {
      const mutateVariables = {
        ...(variables || {}),
        ...(perMutationOptions.variables || {}),
      };
      delete perMutationOptions.variables;

      return client.mutate({
        mutation,
        variables: mutateVariables,
        optimisticResponse,
        refetchQueries,
        awaitRefetchQueries,
        update,
        context,
        fetchPolicy,
        ...perMutationOptions,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      client,
      mutation,
      refetchQueries,
      awaitRefetchQueries,
      update,
      context,
      fetchPolicy,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(variables),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(optimisticResponse),
    ],
  );

  return runMutation;
}
