import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Context} from './context';

export const EXTRACT_ID = Symbol('serialize');

interface SerializeProps<T> {
  data(): T | Promise<T>;
}

interface WithSerializedProps<T> {
  children(data?: T): React.ReactNode;
}

export function createSerializer<T>(id: string) {
  function Serialize({data}: SerializeProps<T>) {
    return (
      <Context.Consumer>
        {(manager) => (
          <Effect
            kind={manager.effect}
            perform={() => {
              const result = data();
              const handleResult = (result: T) =>
                manager.setSerialization(id, result);

              return typeof result === 'object' && isPromise(result)
                ? result.then(handleResult)
                : handleResult(result);
            }}
          />
        )}
      </Context.Consumer>
    );
  }

  function WithSerialized({children}: WithSerializedProps<T>) {
    return (
      <Context.Consumer>
        {(manager) => children(manager.getSerialization(id))}
      </Context.Consumer>
    );
  }

  return {Serialize, WithSerialized};
}

function isPromise<T>(
  maybePromise: T | Promise<T>,
): maybePromise is Promise<T> {
  return maybePromise != null && (maybePromise as any).then != null;
}
