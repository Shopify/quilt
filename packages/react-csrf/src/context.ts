import {createContext} from 'react';

export const CsrfTokenContext = createContext<string | null>(null);
