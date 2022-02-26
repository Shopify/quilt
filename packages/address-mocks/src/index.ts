import {
  GRAPHQL_ENDPOINT,
  LoadCountriesResponse,
  LoadCountryResponse,
  ResponseError,
} from '@shopify/address-consts';
import {fetch} from '@shopify/jest-dom-mocks';

import {fixtures} from './fixtures';

export * from './fixtures';

const OPERATION_NAMES = Object.keys(fixtures);
const LOCALES = Object.keys(fixtures.countries);

export function mockCountryRequests() {
  fetch.post(
    (url, options) => {
      if (url !== GRAPHQL_ENDPOINT || typeof options.body !== 'string') {
        return false;
      }

      const body = JSON.parse(options.body);
      return OPERATION_NAMES.includes(body.operationName);
    },
    (
      _,
      {body},
    ): LoadCountriesResponse | LoadCountryResponse | ResponseError => {
      const {variables, operationName} = JSON.parse(body as string);
      const {countryCode, locale} = variables || {};

      if (!LOCALES.includes(locale)) {
        return {
          errors: [
            {
              message:
                'Variable $locale of type SupportedLocale! was provided invalid value',
            },
          ],
        };
      }

      const countries = fixtures.countries[locale];
      if (operationName === 'countries') return countries;

      const country = countries.data.countries.find(
        ({code}) => code === countryCode,
      );
      if (!country)
        return {
          errors: [
            {
              message:
                'Variable $countryCode of type SupportedCountry! was provided invalid value',
            },
          ],
        };
      return {
        data: {
          country,
        },
      };
    },
    {overwriteRoutes: false},
  );
}
