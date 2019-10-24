import {CsrfTokenContext} from '@shopify/react-csrf';
import {createUniversalProvider} from '@shopify/react-universal-provider';

export const CsrfUniversalProvider = createUniversalProvider<
  string | undefined
>('csrf-token', CsrfTokenContext);
