import {createContext} from 'react';

export interface CsrfTokenData {
  csrfToken: string | undefined;
}

export const CsrfTokenContext = createContext<CsrfTokenData>({
  csrfToken: undefined,
});
