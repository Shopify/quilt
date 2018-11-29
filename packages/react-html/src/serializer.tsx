import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Consumer} from './context';

export const EXTRACT_ID = Symbol('serialize');

interface SerializeProps<T> {
  data(): T;
}

interface WithSerializedProps<T> {
  children(data?: T): React.ReactNode;
}

export function createSerializer<T>(id: string) {
  function Serialize({data}: SerializeProps<T>) {
    return (
      <Consumer>
        {manager => (
          <Effect
            serverOnly
            kind={EXTRACT_ID}
            perform={() => manager.set(id, data())}
          />
        )}
      </Consumer>
    );
  }

  function WithSerialized({children}: WithSerializedProps<T>) {
    return <Consumer>{manager => children(manager.get(id))}</Consumer>;
  }

  return {Serialize, WithSerialized};
}
