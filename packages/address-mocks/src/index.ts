import {fetch} from '@shopify/jest-dom-mocks';
import {
  GRAPHQL_ENDPOINT,
  SUPPORTED_LOCALES,
  GRAPHQL_OPERATION_NAMES,
} from '@shopify/address';

import {
  countriesJa,
  countriesEn,
  countryCAEn,
  countryCAFr,
  countryCAJa,
} from './fixtures';

export const fixtures = {
  [GRAPHQL_OPERATION_NAMES.countries]: {
    DA: countriesEn,
    DE: countriesEn,
    EN: countriesEn,
    ES: countriesEn,
    FR: countriesEn,
    IT: countriesEn,
    JA: countriesJa,
    NL: countriesEn,
    PT: countriesEn,
    PT_BR: countriesEn,
  },
  [GRAPHQL_OPERATION_NAMES.country]: {
    DA: countryCAEn,
    DE: countryCAEn,
    EN: countryCAEn,
    ES: countryCAEn,
    FR: countryCAFr,
    IT: countryCAEn,
    JA: countryCAJa,
    NL: countryCAEn,
    PT: countryCAEn,
    PT_BR: countryCAEn,
  },
};

interface Options {
  method?: string;
  body?: string;
}

export function mockCountryRequests() {
  SUPPORTED_LOCALES.map(locale => {
    Object.values(GRAPHQL_OPERATION_NAMES).map(operationName => {
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
