import {CsrfTokenContext} from '@shopify/react-csrf';
import {createUniversalProvider} from '@shopify/react-universal-provider';

export const CsrfUniversalProvider = createUniversalProvider<string>(
  'csrf-token',
  CsrfTokenContext,
);
