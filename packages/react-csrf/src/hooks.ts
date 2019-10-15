import {useContext} from 'react';
import {CsrfTokenContext} from './context';

export function useCsrfToken() {
  const csrf = useContext(CsrfTokenContext);

  if (csrf === undefined) {
    throw new Error('No CSRF token found in context.');
  }

  return csrf;
}
