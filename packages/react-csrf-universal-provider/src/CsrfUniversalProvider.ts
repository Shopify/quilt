import {CsrfTokenContext, CsrfTokenData} from '@shopify/react-csrf';
import {createUniversalProvider} from '@shopify/react-universal-provider';

export const CsrfUniversalProvider = createUniversalProvider<CsrfTokenData>(
  'csrf-token',
  CsrfTokenContext,
);
