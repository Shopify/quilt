import {ApolloLink, Observable, FetchResult} from 'apollo-link';
import {now} from '@shopify/performance';
import {Header} from '@shopify/network';

export interface GraphQLOperation {
  name: string;
  duration: number;
  start: number;
  end: number;
  success: boolean;
  errors?: {message: string; path?: string}[];
  url?: string;
  status?: number;
  requestId?: string;
}

export interface Options {
  onOperation(operation: GraphQLOperation): void;
}

export function createOperationDetailsLink({onOperation}: Options) {
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

      const {response} = operation.getContext();

      const requestId =
        response instanceof Response
          ? response.headers.get(Header.RequestId) || undefined
          : undefined;

      const status = response instanceof Response ? response.status : undefined;
      const url = response instanceof Response ? response.url : undefined;

      onOperation({
        name: operation.operationName,
        url,
        status,
        success,
        errors,
        requestId,
        duration,
        start,
        end,
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
