import {createContext} from 'react';

export const CsrfTokenContext = createContext<string | undefined>(undefined);
