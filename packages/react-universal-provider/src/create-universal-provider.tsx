import React from 'react';
import {useSerialized} from '@shopify/react-html';

export interface UniversalProviderProps<Value> {
  value?: Value;
  children?: React.ReactNode;
}

export function createUniversalProvider<Value>(
  id: string,
  Context: React.Context<Value>,
) {
  const UniversalProvider = React.memo(
    ({value: explicitValue, children}: UniversalProviderProps<Value>) => {
      const [value = explicitValue, Serialize] = useSerialized<Value>(id);

      if (value == null) {
        throw new Error(
          `You must provide a ${id} value, or have one previously serialized.`,
        );
      }

      return (
        <>
          <Context.Provider value={value}>{children}</Context.Provider>
          <Serialize data={() => value} />
        </>
      );
    },
  );

  const prefix = `${id.charAt(0).toUpperCase()}${id.slice(1).toLowerCase()}`;

  UniversalProvider.displayName = `${prefix}UniversalProvider`;

  return UniversalProvider;
}
