import {parse, Language} from 'accept-language-parser';
import {useContext, useState, useEffect} from 'react';
import {CookieSerializeOptions} from 'cookie';
import {CspDirective, StatusCode, Header} from '@shopify/network';
import {useServerEffect} from '@shopify/react-effect';

import {NetworkContext} from './context';
import {NetworkManager, setBrowserCookie} from './manager';

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

export function useAcceptLanguage(
  fallback: Language = {code: 'en', quality: 1.0},
) {
  const acceptsLanguages = useRequestHeader(Header.AcceptLanguage);
  const locales = acceptsLanguages ? parse(acceptsLanguages) : [fallback];

  return locales;
}

export function useServerCookie(key: string) {
  console.log('using server cookie', key);
  useNetworkEffect(network => {
    console.log(network);
    const cookie = network.getCookie(key);
    console.log(cookie, key);
    return cookie;
  });
}

export function useCookie(
  key: string,
): [
  string | undefined,
  (value: string, options?: CookieSerializeOptions) => void
] {
  const network = useContext(NetworkContext);
  const [cookie, setCookieValue] = useState(() => {
    console.log('the network is', network);
    return network ? network.getCookie(key) : undefined;
  });

  useEffect(
    () => {
      console.log('the network is', network);
    },
    [network],
  );

  const setCookie = (value: string, options?: CookieSerializeOptions) => {
    setCookieValue(value);

    if (!network) {
      setBrowserCookie(key, value, options);
      return;
    }

    network.setCookie(key, value, options);
  };

  return [cookie, setCookie];
}
