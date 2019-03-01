import * as React from 'react';
import {useServerEffect} from '@shopify/react-effect';
import {HtmlContext} from './context';

export const EXTRACT_ID = Symbol('serialize');

interface SerializeProps<T> {
  data: () => T | Promise<T>;
}

interface WithSerializedProps<T> {
  children(data?: T): React.ReactElement<any>;
}

export function useSerialized<T>(
  id: string,
): [T | undefined, React.ComponentType<SerializeProps<T>>] {
  const manager = React.useContext(HtmlContext);
  const data = React.useMemo(() => manager && manager.getSerialization<T>(id), [
    id,
    manager,
  ]);

  const Serialize = React.useMemo(
    () =>
      function Serialize({data}: SerializeProps<T>) {
        const manager = React.useContext(HtmlContext);

        useServerEffect(() => {
          const result = data();
          const handleResult = manager
            ? manager.setSerialization.bind(manager, id)
            : noop;

          return typeof result === 'object' && isPromise(result)
            ? result.then(handleResult)
            : handleResult(result);
        }, manager && manager.effect);

        return null;
      },
    [id, manager],
  );

  return [data, Serialize];
}

export function createSerializer<T>(id: string) {
  function Serialize({data}: SerializeProps<T>) {
    const manager = React.useContext(HtmlContext);

    useServerEffect(() => {
      const result = data();
      const handleResult = manager
        ? manager.setSerialization.bind(manager, id)
        : noop;

      return typeof result === 'object' && isPromise(result)
        ? result.then(handleResult)
        : handleResult(result);
    }, manager && manager.effect);

    return null;
  }

  function WithSerialized({children}: WithSerializedProps<T>) {
    const manager = React.useContext(HtmlContext);
    return children(manager && manager.getSerialization<T>(id));
  }

  return {Serialize, WithSerialized};
}

function isPromise<T>(
  maybePromise: T | Promise<T>,
): maybePromise is Promise<T> {
  return maybePromise != null && (maybePromise as any).then != null;
}

function noop() {}
