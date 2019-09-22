import {createUniversalProvider} from '@shopify/react-universal-provider';
import {CsrfTokenContext} from '@shopify/react-csrf';

export const CsrfUniversalProvider = createUniversalProvider<string>(
  'csrf-token',
  CsrfTokenContext,
);
