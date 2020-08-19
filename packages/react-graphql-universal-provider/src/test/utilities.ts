import {GraphQLError} from 'graphql';
import {
  ApolloLink,
  execute,
  Operation,
  Observable,
  FetchResult,
  NextLink,
} from 'apollo-link';
import {ErrorHandler} from 'apollo-link-error';
import {DocumentNode} from 'graphql-typed';
import {StatusCode} from '@shopify/network';

interface ExecuteOnceOutcome {
  operation: Operation;
  result?: FetchResult;
  error?: Error;
}

export function executeOnce(link: ApolloLink, query: DocumentNode) {
  let op: Operation;
  const storeLink = new ApolloLink((operation, nextLink) => {
    op = operation;

    if (nextLink == null) {
      return null;
    }

    return nextLink(operation);
  });

  return new Promise<ExecuteOnceOutcome>(resolve => {
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
type SimpleResult = object | Error | Promise<object | Error>;

export class SimpleLink extends ApolloLink {
  constructor(
    private result: object | Error | Promise<object | Error> = {data: {}},
    private beforeResult: BeforeResult = noop,
  ) {
    super();
  }

  request(operation: Operation, nextLink?: NextLink) {
    this.beforeResult(operation);

    if (nextLink != null) {
      return nextLink(operation);
    }

    return new Observable<FetchResult>(obs => {
      function handleResult(result: Record<string, any> | Error) {
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

export class SimpleHttpLink extends SimpleLink {
  constructor(
    response: Response,
    result?: SimpleResult,
    beforeResult: BeforeResult = noop,
  ) {
    super(result, operation => {
      beforeResult(operation);
      operation.setContext({response});
    });
  }
}

export default class SetContextLink extends SimpleLink {
  constructor(context: {[key: string]: any}, result?: SimpleResult) {
    super(result, operation => {
      operation.setContext(context);
    });
  }
}

export function wrapLinkWithContext(
  link: ApolloLink,
  context: {[key: string]: any},
) {
  return ApolloLink.from([new SetContextLink(context), link]);
}

export class InitializationErrorLink extends SimpleLink {
  constructor(private error: Error = new Error()) {
    super();
  }

  request(operation: Operation, nextLink?: NextLink) {
    if (this.error) {
      throw this.error;
    }

    return super.request(operation, nextLink);
  }
}

export class NetworkError extends Error {
  constructor(
    public response: Response = new Response('', {
      status: StatusCode.InternalServerError,
    }),
    url?: string,
  ) {
    super('Network error');

    if (url) {
      // It is marked as readonly, this gets around the resulting type error
      Reflect.defineProperty(response, 'url', {value: url});
    }
  }
}

export class NetworkErrorLink extends SimpleLink {
  error: NetworkError;

  constructor(response?: Response, {url}: {url?: string} = {}) {
    const error = new NetworkError(response, url);
    super(error);
    this.error = error;
  }
}

export class ServerParseError extends Error {
  bodyText: string;
  name = 'ServerParseError';
  statusCode = StatusCode.InternalServerError;
  response = new Response('', {
    status: StatusCode.InternalServerError,
  });

  constructor(errorText: string) {
    super('Unexpected token < in JSON at position 0');
    this.bodyText = errorText;
  }
}

export class ServerParseErrorLink extends ApolloLink {
  private link: ApolloLink;
  constructor(parseErrorHandler: ErrorHandler, badJSONText: string) {
    super();
    this.link = new ApolloLink((operation, forward) => {
      return new Observable(observer => {
        const err = new ServerParseError(badJSONText);
        parseErrorHandler({networkError: err, operation, forward});
        observer.error(err);
      });
    });
  }

  request(
    operation: Operation,
    nextLink: NextLink,
  ): Observable<FetchResult> | null {
    return this.link.request(operation, nextLink);
  }
}

export class GraphQLErrorLink extends SimpleLink {
  constructor(graphQLError: GraphQLError) {
    super({errors: [graphQLError]});
  }
}

function noop() {}
