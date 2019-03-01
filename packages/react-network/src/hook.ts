import {useContext} from 'react';
import {useServerEffect} from '@shopify/react-effect';

import {NetworkContext} from './context';
import {Manager} from './manager';

export function useNetworkEffect(perform: (network: Manager) => void) {
  const network = useContext(NetworkContext);
  useServerEffect(
    () => {
      if (network != null) {
        return perform(network);
      }
    },
    network ? network.effect : undefined,
  );
}
