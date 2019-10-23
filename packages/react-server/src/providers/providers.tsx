import React from 'react';
import {useRequestHeader} from '@shopify/react-network';
import {CsrfUniversalProvider} from '@shopify/react-csrf-universal-provider';
import {CookieUniversalProvider} from '@shopify/react-cookie';
import {ConditionalProvider} from './ConditionalProvider';

interface Options {
  csrf?: boolean;
}

interface Props {
  children: any;
}

export function createCombinedProvider(options?: Options) {
  const {csrf = true} = options || {};

  return function CombinedProvider({children}: Props) {
    const csrfToken = useRequestHeader('x-csrf-token') || '';

    return (
      <CookieUniversalProvider>
        <ConditionalProvider
          provider={CsrfUniversalProvider}
          condition={csrf}
          props={{value: csrfToken}}
        >
          {children}
        </ConditionalProvider>
      </CookieUniversalProvider>
    );
  };
}

export const DefaultProvider = createCombinedProvider();
