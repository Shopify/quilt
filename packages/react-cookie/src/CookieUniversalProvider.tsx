import React from 'react';
import {useNetworkManager} from '@shopify/react-network';
import {useLazyRef} from '@shopify/react-hooks';

import {BrowserCookieManager} from './BrowserCookieManager';
import {CookieContext} from './context';
import {hasDocumentCookie} from './utilities';

const NO_MANAGER_ERROR = [
  'Could not find react-network context.',
  'A `<NetworkContext.Provider />` is likely',
  'missing in your application component tree.',
].join(' ');

export interface Props {
  children?: React.ReactNode;
  server?: boolean;
}

export function CookieUniversalProvider({server, children}: Props) {
  const manager = useNetworkManager();

  const cookieManager = useLazyRef(() => {
    if (!server && hasDocumentCookie()) {
      return new BrowserCookieManager();
    }

    if (manager == null) {
      throw new Error(NO_MANAGER_ERROR);
    }

    return manager.cookies;
  }).current;

  return (
    <CookieContext.Provider value={cookieManager}>
      {children}
    </CookieContext.Provider>
  );
}
