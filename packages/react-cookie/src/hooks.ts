import {useContext, useState, useCallback} from 'react';
import {CookieSerializeOptions} from 'cookie';

import {CookieContext} from './context';

const NO_MANAGER_ERROR = [
  'Could not find react-cookie context.',
  'You might be missing the <CookieUniversalProvider />',
  'component in your application component tree.',
].join(' ');

export function useCookie(
  key: string,
): [
  string | undefined,
  (value?: string, options?: CookieSerializeOptions) => void
] {
  const manager = useContext(CookieContext);

  if (!manager) {
    throw new Error(NO_MANAGER_ERROR);
  }

  const [cookie, setCookieValue] = useState(() =>
    manager ? manager.getCookie(key) : undefined,
  );

  const setCookie = useCallback(
    (value?: string, options?: CookieSerializeOptions) => {
      if (!value) {
        setCookieValue('');
        manager.removeCookie(key);

        return;
      }

      setCookieValue(value);
      manager.setCookie(key, {value, ...options});
    },
    [key, manager],
  );

  return [cookie, setCookie];
}
