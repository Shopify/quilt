import {ApolloLink, Observable, FetchResult, Operation} from 'apollo-link';
import {now} from '@shopify/performance';
import {GraphQLOperationDetails} from '../types';

export interface Options {
  onOperation(operation: GraphQLOperationDetails): void;
  additionalFields?: (operation: Operation) => {};
}

export function createOperationDetailsLink({
  onOperation,
  additionalFields,
}: Options) {
  return new ApolloLink((operation, forward) => {
    if (forward == null) {
      return null;
    }

    const start = now();

    function logOperation(result: FetchResult | Error) {
      const end = now();
      const duration = end - start;
      const success =
        result != null && !(result instanceof Error) && result.data != null;

      const errors =
        result != null && !(result instanceof Error) && result.errors
          ? result.errors.map(({message, path}) => ({
              message,
              path: path && Array.isArray(path) ? path.join(',') : undefined,
            }))
          : undefined;

      onOperation({
        name: operation.operationName,
        success,
        errors,
        duration,
        start,
        end,
        ...(additionalFields ? additionalFields(operation) : {}),
      });
    }

    return new Observable(observer => {
      return forward(operation).subscribe({
        complete: observer.complete.bind(observer),
        next(result) {
          logOperation(result);
          observer.next(result);
        },
        error(error) {
          logOperation(error);
          observer.error(error);
        },
      });
    });
  });
}
