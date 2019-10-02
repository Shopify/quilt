import {
  OperationVariables,
  MutationOptions as ClientMutationOptions,
} from 'apollo-client';
import {MutationOptions} from 'react-apollo';
import {DocumentNode} from 'graphql-typed';
import {useCallback} from 'react';
import {Omit} from '@shopify/useful-types';

import {MutationHookOptions, MutationHookResult} from './types';
import useApolloClient from './apollo-client';

export default function useMutation<Data = any, Variables = OperationVariables>(
  mutation: DocumentNode<Data, Variables>,
  options: Omit<
    MutationHookOptions<Data, Variables>,
    'mutation' | 'fetchPolicy'
  > &
    Pick<ClientMutationOptions<Data, Variables>, 'fetchPolicy'> = {},
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
    (
      perMutationOptions: Omit<
        MutationOptions<Data, Variables>,
        'mutation' | 'fetchPolicy'
      > &
        Pick<ClientMutationOptions<Data, Variables>, 'fetchPolicy'> = {},
    ) => {
      const mutateVariables = {
        ...(variables || {}),
        ...(perMutationOptions.variables || {}),
      };
      delete perMutationOptions.variables;

      return client.mutate({
        mutation,
        variables: mutateVariables as any,
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
