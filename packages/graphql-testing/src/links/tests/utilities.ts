import {
  ApolloLink,
  execute,
  Operation,
  Observable,
  FetchResult,
  NextLink,
} from '@apollo/client';
import {DocumentNode} from 'graphql-typed';

interface ExecuteOnceOutcome {
  operation: Operation;
  result?: FetchResult;
  error?: Error;
}

function noop() {}

export function executeOnce(link: ApolloLink, query: DocumentNode) {
  let op: Operation;
  const storeLink = new ApolloLink((operation, nextLink) => {
    op = operation;

    if (nextLink == null) {
      return null;
    }

    return nextLink(operation);
  });

  return new Promise<ExecuteOnceOutcome>((resolve) => {
    execute(storeLink.concat(link), {query}).subscribe({
      next(result) {
        resolve({operation: op, result});
      },
      error(error) {
        resolve({operation: op, error});
      },
    });
  });
}

type BeforeResult = (operation: Operation) => void;

export class SimpleLink extends ApolloLink {
  constructor(
    private result: object | Error | Promise<object | Error> = {data: {}},
    private beforeResult: BeforeResult = noop,
  ) {
    super();
  }

  request(
    operation: Operation,
    nextLink?: NextLink,
  ): Observable<FetchResult> | null {
    this.beforeResult(operation);

    if (nextLink != null) {
      return nextLink(operation);
    }

    return new Observable((obs) => {
      function handleResult(result: object | Error) {
        if (result instanceof Error) {
          obs.error(result);
        } else {
          obs.next(result);
        }

        obs.complete();
      }

      if (this.result instanceof Promise) {
        this.result.then(handleResult).catch(handleResult);
      } else {
        handleResult(this.result);
      }
    });
  }
}
