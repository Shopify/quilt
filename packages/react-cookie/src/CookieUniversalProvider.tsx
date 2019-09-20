import React from 'react';
import {useNetworkManager} from '@shopify/react-network';
import {useLazyRef} from '@shopify/react-hooks';
import {CookieManager} from './manager';
import {CookieContext} from './context';
import {hasDocumentCookie} from './utilities';

export interface Props {
  children?: React.ReactNode;
}

export function CookieUniversalProvider({children}: Props) {
  const manager = useNetworkManager();

  const cookieManager = useLazyRef(() => {
    return !hasDocumentCookie() && manager
      ? manager.cookies
      : new CookieManager();
  }).current;

  return (
    <CookieContext.Provider value={cookieManager}>
      {children}
    </CookieContext.Provider>
  );
}
