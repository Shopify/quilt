import React from 'react';
import {useLazyRef} from '@shopify/react-hooks';

import {useNetworkManager} from './hooks';
import {
  NetworkUniversalProvider as UniversalProvider,
  NetworkUniversalDetails,
} from './context';

interface Props {
  children?: React.ReactNode;
  headers: string[];
}

export function NetworkUniversalProvider({
  children,
  headers: headerNames,
}: Props) {
  const network = useNetworkManager();
  const universalDetails = useLazyRef<NetworkUniversalDetails | null>(() => {
    if (!network) {
      return null;
    }

    const result: NetworkUniversalDetails = {headers: {}};

    headerNames.forEach(header => {
      result.headers[header.toLowerCase()] = network.getHeader(header);
    });

    return result;
  }).current;

  return (
    <UniversalProvider value={universalDetails}>{children}</UniversalProvider>
  );
}
