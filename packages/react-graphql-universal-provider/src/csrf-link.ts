import {setContext} from 'apollo-link-context';

export const SAME_SITE_HEADER = 'x-shopify-react-xhr';
export const SAME_SITE_VALUE = '1';

export const csrfLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      [SAME_SITE_HEADER]: SAME_SITE_VALUE,
    },
  };
});
