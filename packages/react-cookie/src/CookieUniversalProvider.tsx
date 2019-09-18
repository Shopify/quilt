import React from 'react';
import {useRequestHeader} from '@shopify/react-network';
import {useLazyRef} from '@shopify/react-hooks';
import {useSerialized} from '@shopify/react-html';
import {CookieManager} from './manager';
import {CookieContext} from './context';
import {hasDocumentCookie} from './utilities';
import {Cookies} from './types';

export interface Props {
  children?: React.ReactNode;
}

export function CookieUniversalProvider({children}: Props) {
  const [initialCookies, Serialize] = useSerialized<Cookies>('cookies');
  const serverCookieHeader = useRequestHeader('cookie');

  const manager = useLazyRef(() => {
    const cookies = hasDocumentCookie() ? document.cookie : serverCookieHeader;

    return new CookieManager(initialCookies || cookies);
  }).current;

  return (
    <>
      <CookieContext.Provider value={manager}>
        {children}
      </CookieContext.Provider>
      <Serialize data={() => manager.getCookies()} />
    </>
  );
}
