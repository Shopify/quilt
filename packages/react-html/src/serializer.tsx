import React from 'react';
import {useServerEffect} from '@shopify/react-effect';

import {HtmlContext} from './context';
import {useServerDomEffect} from './hooks';

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
  const value = manager.getSerialization<T>(id);

  const Serialize = React.useMemo(
    () =>
      function Serialize({data}: SerializeProps<T>) {
        useServerDomEffect((manager) => {
          const result = data();
          const handleResult = manager.setSerialization.bind(manager, id);

          return typeof result === 'object' &&
            result != null &&
            isPromise(result)
            ? result.then(handleResult)
            : handleResult(result);
        });

        return null;
      },
    [id],
  );

  return [value, Serialize];
}

export function createSerializer<T>(id: string) {
  function Serialize({data}: SerializeProps<T>) {
    const manager = React.useContext(HtmlContext);

    useServerEffect(() => {
      const result = data();
      const handleResult = manager.setSerialization.bind(manager, id);

      return typeof result === 'object' && result != null && isPromise(result)
        ? result.then(handleResult)
        : handleResult(result);
    }, manager?.effect);

    return null;
  }

  function WithSerialized({children}: WithSerializedProps<T>) {
    const manager = React.useContext(HtmlContext);
    return children(manager.getSerialization<T>(id));
  }

  return {Serialize, WithSerialized};
}

function isPromise<T>(
  maybePromise: T | Promise<T>,
): maybePromise is Promise<T> {
  return maybePromise != null && (maybePromise as any).then != null;
}
