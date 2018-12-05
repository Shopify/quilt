import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Context} from './context';

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
      <Context.Consumer>
        {manager => (
          <Effect
            serverOnly
            kind={EXTRACT_ID}
            perform={() => manager.setSerialization(id, data())}
          />
        )}
      </Context.Consumer>
    );
  }

  function WithSerialized({children}: WithSerializedProps<T>) {
    return (
      <Context.Consumer>
        {manager => children(manager.getSerialization(id))}
      </Context.Consumer>
    );
  }

  return {Serialize, WithSerialized};
}
