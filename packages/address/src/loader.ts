import {
  Country,
  LoadCountriesResponse,
  LoadCountryResponse,
  ResponseError,
  GRAPHQL_ENDPOINT,
  SUPPORTED_LOCALES,
  HEADERS,
  GraphqlOperationName,
} from '@shopify/address-consts';

import query from './graphqlQuery';

export const loadCountries: (
  locale: string,
) => Promise<Country[]> = memoizeAsync(async (locale: string) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      query,
      operationName: GraphqlOperationName.Countries,
      variables: {
        locale: toSupportedLocale(locale),
      },
    }),
  });

  const countries:
    | LoadCountriesResponse
    | ResponseError = await response.json();

  if ('errors' in countries) {
    throw new CountryLoaderError(countries);
  }

  return countries.data.countries;
});

export const loadCountry: (
  locale: string,
  countryCode: string,
) => Promise<Country> = memoizeAsync(
  async (locale: string, countryCode: string): Promise<Country> => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        query,
        operationName: GraphqlOperationName.Country,
        variables: {
          countryCode,
          locale: toSupportedLocale(locale),
        },
      }),
    });

    const country: LoadCountryResponse = await response.json();

    if ('errors' in country) {
      throw new CountryLoaderError(country);
    }

    return country.data.country;
  },
);

class CountryLoaderError extends Error {
  constructor(errors: ResponseError) {
    const errorMessage = errors.errors.map(error => error.message).join('; ');
    super(errorMessage);
  }
}

const DEFAULT_LOCALE = 'EN';

export function toSupportedLocale(locale: string) {
  const supportedLocale = locale.replace(/-/, '_').toUpperCase();

  if (SUPPORTED_LOCALES.includes(supportedLocale)) {
    return supportedLocale;
  } else if (SUPPORTED_LOCALES.includes(supportedLocale.substring(0, 2))) {
    return supportedLocale.substring(0, 2);
  } else {
    return DEFAULT_LOCALE;
  }
}

type AsyncFunc = (...args: any[]) => Promise<any>;
interface Cache {
  [key: string]: Promise<any>;
}

function memoizeAsync(asyncFunction: AsyncFunc) {
  const cache: Cache = {};

  return (...args: any[]) => {
    const stringifiedArgs = JSON.stringify(args);
    if (!cache[stringifiedArgs]) {
      cache[stringifiedArgs] = asyncFunction.apply(this, args);
    }
    return cache[stringifiedArgs];
  };
}
