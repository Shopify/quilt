import {fetch} from '@shopify/jest-dom-mocks';
import type {
  LoadCountriesResponse,
  LoadCountryResponse,
  ResponseError,
} from '@shopify/address-consts';
import {GRAPHQL_ENDPOINT} from '@shopify/address-consts';

import type {Fixtures, MockOptions} from './types';

const OPERATION_NAMES = ['countries', 'country'];

type FixtureLoader = () => Fixtures | Promise<Fixtures>;

export const defaultFixtureLoader: FixtureLoader = async () => {
  return (await import('./fixtures/fixtures-light')).default;
};

export function mockCountryRequestsLazy(
  loadFixtures: FixtureLoader = defaultFixtureLoader,
  options: MockOptions = {},
) {
  return fetch.post(requestMatcher, createMockHandler(loadFixtures), {
    overwriteRoutes: false,
    ...options,
  });
}

export function requestMatcher(url, options) {
  if (url !== GRAPHQL_ENDPOINT || typeof options.body !== 'string') {
    return false;
  }

  const body = JSON.parse(options.body);
  return OPERATION_NAMES.includes(body.operationName);
}

export function createMockHandler(loadFixtures: FixtureLoader) {
  let fixtures: Fixtures;
  return async function lazyRequestHandler(
    _,
    {body},
  ): Promise<LoadCountriesResponse | LoadCountryResponse | ResponseError> {
    if (!fixtures) {
      fixtures = await loadFixtures();
    }
    const locales = Object.keys(fixtures.countries);
    const {variables, operationName} = JSON.parse(body as string);
    const {countryCode, locale, includeHiddenZones} = variables || {};

    if (!locales.includes(locale)) {
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

    if (includeHiddenZones) {
      const indiaIndex = countries.data.countries.findIndex(
        (country) => country.code === 'IN',
      );

      // localized names of DH in the supported languages
      const dhNames = {
        // CLDR doesn't translate this name for AF, so use the EN fallback
        en: 'Dadra and Nagar Haveli and Daman and Diu',
        fr: 'Dadra et Nagar Haveli et Daman et Diu',
        ja: 'ダードラー及びナガル・ハヴェーリー及びダマン及びディーウ連邦直轄領',
      };

      countries.data.countries[indiaIndex].zones.push({
        name: dhNames[locale] || dhNames.en,
        code: 'DH',
      });
    }

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
  };
}
