import {GRAPHQL_ENDPOINT, SUPPORTED_LOCALES} from '@shopify/address-consts';
import {fetch} from '@shopify/jest-dom-mocks';

import {fixtures} from './fixtures';

export * from './fixtures';

interface Options {
  method?: string;
  body?: string;
}

export function mockCountryRequests() {
  const unsupportedLocales = ['AF'];
  SUPPORTED_LOCALES.concat(unsupportedLocales).map(locale => {
    ['countries', 'country'].map(operationName => {
      fetch.mock(
        (url: string, options: Options) => {
          if (url !== GRAPHQL_ENDPOINT || options.method !== 'POST') {
            return false;
          }
          if (typeof options.body === 'string') {
            const body = JSON.parse(options.body);
            return (
              body.operationName === operationName &&
              body.variables.locale === locale
            );
          }
          return false;
        },
        fixtures[operationName][locale],
        {overwriteRoutes: false},
      );
    });
  });
}
