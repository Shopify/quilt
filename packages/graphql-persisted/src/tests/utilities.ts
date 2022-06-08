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
type Result = {data: object} | {errors: {message: string}[]} | Error;
type MultiResult =
  | Result
  | Promise<Result>
  | Result[]
  | ((index: number) => Result);

export class SimpleLink extends ApolloLink {
  private resultIndex = 0;

  constructor(
    private result: MultiResult = {
      data: {},
    },
    private beforeResult: BeforeResult = noop,
  ) {
    super();
  }

  request(operation: Operation, nextLink?: NextLink): Observable<any> {
    this.beforeResult(operation);

    if (nextLink != null) {
      return nextLink(operation);
    }

    return new Observable((obs) => {
      const handleResult = (result: Result) => {
        this.resultIndex += 1;

        if (result instanceof Error) {
          obs.error(result);
        } else {
          obs.next(result);
        }

        obs.complete();
      };

      if (this.result instanceof Promise) {
        this.result.then(handleResult).catch(handleResult);
      } else if (Array.isArray(this.result)) {
        handleResult(this.result[this.resultIndex]);
      } else if (typeof this.result === 'function') {
        handleResult(this.result(this.resultIndex));
      } else {
        handleResult(this.result);
      }
    });
  }
}
