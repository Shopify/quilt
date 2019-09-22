import {ApolloLink, Operation, NextLink, Observable} from 'apollo-link';
import {CacheMissBehavior} from './shared';

interface Options {
  idFromOperation?(operation: Operation): string | undefined | null;
}

export function createPersistedLink(options: Options = {}) {
  return new PersistedLink(options);
}

export class PersistedLink extends ApolloLink {
  private sendAlwaysIds = new Set<string>();

  constructor(private options: Options) {
    super();
  }

  request(operation: Operation, forward?: NextLink) {
    if (forward == null) {
      throw new Error('Persisted link can’t be a terminating link.');
    }

    return new Observable(observer => {
      const {idFromOperation = defaultIdFromOperation} = this.options;
      const id = idFromOperation(operation);

      if (typeof id !== 'string' || this.sendAlwaysIds.has(id)) {
        const subscription = forward(operation).subscribe(observer);
        return () => subscription.unsubscribe();
      }

      operation.extensions.persisted = {
        id,
      };

      operation.setContext({
        http: {
          includeQuery: false,
          includeExtensions: true,
        },
      });

      let subscription: ReturnType<
        ReturnType<typeof forward>['subscribe']
      > | null = null;

      subscription = forward(operation).subscribe({
        next: response => {
          const errors = (response && response.errors) || [];

          if (
            errors.some(({message}) =>
              message.includes(CacheMissBehavior.SendAlways),
            )
          ) {
            this.sendAlwaysIds.add(id);

            if (subscription != null) {
              subscription.unsubscribe();
            }

            delete operation.extensions.persisted;

            operation.setContext({
              http: {
                includeQuery: true,
                includeExtensions: false,
              },
            });

            subscription = forward(operation).subscribe(observer);
          } else if (
            errors.some(({message}) =>
              message.includes(CacheMissBehavior.SendAndStore),
            )
          ) {
            if (subscription != null) {
              subscription.unsubscribe();
            }

            operation.setContext({
              http: {
                includeQuery: true,
                includeExtensions: true,
              },
            });

            subscription = forward(operation).subscribe(observer);
          } else {
            observer.next(response);
          }
        },
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });

      return () => {
        if (subscription != null) {
          subscription.unsubscribe();
        }
      };
    });
  }
}

function defaultIdFromOperation(operation: Operation) {
  return (operation.query as any).id || null;
}
