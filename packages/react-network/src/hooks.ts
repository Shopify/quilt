<<<<<<< Updated upstream
import {useContext, useState} from 'react';
import {CookieSerializeOptions} from 'cookie';
=======
import {useContext} from 'react';
import {CookieSetOptions} from 'universal-cookie';
>>>>>>> Stashed changes
import {CspDirective, StatusCode} from '@shopify/network';
import {useServerEffect} from '@shopify/react-effect';

import {NetworkContext} from './context';
import {NetworkManager} from './manager';

export function useNetworkEffect(perform: (network: NetworkManager) => void) {
  const network = useContext(NetworkContext);

  useServerEffect(() => {
    if (network != null) {
      return perform(network);
    }
  }, network ? network.effect : undefined);
}

export function useCspDirective(
  directive: CspDirective,
  source: string | string[] | boolean,
) {
  useNetworkEffect(network => network.addCspDirective(directive, source));
}

export function useRequestHeader(header: string) {
  const network = useContext(NetworkContext);
  return network ? network.getHeader(header) : undefined;
}

export function useHeader(header: string, value: string) {
  useNetworkEffect(network => network.setHeader(header, value));
}

export function useStatus(code: StatusCode) {
  useNetworkEffect(network => network.addStatusCode(code));
}

export function useRedirect(url: string, status?: StatusCode) {
  useNetworkEffect(network => network.redirectTo(url, status));
}

export function useCookie(
<<<<<<< Updated upstream
  key: string,
): [
  string | undefined,
  (value: string, options?: CookieSerializeOptions) => void
] {
=======
  cookie: string,
): [string | undefined, (value: string, options?: CookieSetOptions) => void] {
>>>>>>> Stashed changes
  const network = useContext(NetworkContext);
  const [cookie, setCookieValue] = useState(() => {
    return network ? network.getCookie(key) : undefined;
  });

<<<<<<< Updated upstream
  const setCookie = (value: string, options?: CookieSerializeOptions) => {
=======
  const setCookie = (value: string, options?: CookieSetOptions) => {
>>>>>>> Stashed changes
    if (!network) {
      return;
    }

    setCookieValue(value);
    network.setCookie(key, value, options);
  };

  return [cookie, setCookie];
}
