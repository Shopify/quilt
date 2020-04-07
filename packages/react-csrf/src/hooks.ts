import {useContext} from 'react';

import {CsrfTokenContext} from './context';

export function useCsrfToken() {
  const csrf = useContext(CsrfTokenContext);

  if (!csrf || csrf.csrfToken === undefined) {
    throw new Error('No CSRF token found in context.');
  }

  return csrf.csrfToken;
}
