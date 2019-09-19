import React from 'react';
import {useRequestHeader} from '@shopify/react-network';
import {useLazyRef} from '@shopify/react-hooks';
import {CookieManager} from './manager';
import {CookieContext} from './context';
import {hasDocumentCookie} from './utilities';

export interface Props {
  children?: React.ReactNode;
}

export function CookieUniversalProvider({children}: Props) {
  const serverCookieHeader = useRequestHeader('cookie');

  const manager = useLazyRef(() => {
    const cookies = hasDocumentCookie() ? document.cookie : serverCookieHeader;

    return new CookieManager(cookies);
  }).current;

  return (
    <CookieContext.Provider value={manager}>{children}</CookieContext.Provider>
  );
}
