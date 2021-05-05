import {useCallback, useMemo} from 'react';
import {OperationVariables} from 'apollo-client';
import {NoInfer} from '@shopify/useful-types';

import {QueryDocument} from '../types';
import {MutationHookOptions, MutationHookResult} from './types';
import useApolloClient from './apollo-client';
import {normalizeDocument} from './graphql-document';

export default function useMutation<Data = any, Variables = OperationVariables>(
  mutation: QueryDocument<Data, Variables>,
  options: MutationHookOptions<Data, NoInfer<Partial<Variables>>> = {} as any,
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
  const document = useMemo(() => normalizeDocument(mutation), [mutation]);

  const runMutation = useCallback(
    (perMutationOptions: MutationHookOptions<Data, Variables> = {} as any) => {
      const mutateVariables = {
        ...(variables || {}),
        ...(perMutationOptions.variables || {}),
      };
      delete perMutationOptions.variables;

      return client.mutate({
        mutation: document,
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

  return runMutation as MutationHookResult<Data, Variables>;
}
