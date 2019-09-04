import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {useRequestHeader} from '@shopify/react-network';
import {CsrfUniversalProvider} from '@shopify/react-csrf-universal-provider';
import {ConditionalProvider} from './ConditionalProvider';

interface Options {
  cookies?: boolean;
  csrf?: boolean;
}

interface Props {
  children: any;
}

export function createCombinedProvider(options?: Options) {
  const {cookies = true, csrf = true} = options || {};

  return function CombinedProvider({children}: Props) {
    const csrfToken = useRequestHeader('x-csrf-token');

    return (
      <ConditionalProvider provider={CookiesProvider} condition={cookies}>
        <ConditionalProvider
          provider={CsrfUniversalProvider}
          condition={csrf}
          props={{value: csrfToken}}
        >
          {children}
        </ConditionalProvider>
      </ConditionalProvider>
    );
  };
}

export const DefaultProvider = createCombinedProvider();
