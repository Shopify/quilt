import React from 'react';
import {useSerialized} from '@shopify/react-html';

interface Props<Data> {
  data?: Data;
  children: React.ReactNode;
}

export function createSelfSerializer<Data>(
  id: string,
  Context: React.Context<Data | null>,
) {
  return React.memo(({data: explicitData, children}: Props<Data>) => {
    const [data = explicitData, Serialize] = useSerialized<Data>(id);

    if (!data) {
      // eslint-disable-next-line no-console
      console.error(
        `You must provide a ${id}, or have one previously serialized.`,
      );
      return null;
    }

    return (
      <>
        <Context.Provider value={data}>{children}</Context.Provider>
        <Serialize data={() => data} />
      </>
    );
  });
}
