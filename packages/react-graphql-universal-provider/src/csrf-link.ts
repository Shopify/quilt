import {setContext} from '@apollo/client/link/context';

export const SAME_SITE_HEADER = 'x-shopify-react-xhr';
export const SAME_SITE_VALUE = '1';

export function createCsrfLink() {
  return setContext((_, {headers}) => ({
    headers: {
      ...headers,
      [SAME_SITE_HEADER]: SAME_SITE_VALUE,
    },
  }));
}
