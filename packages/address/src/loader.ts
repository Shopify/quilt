import {
  Country,
  TimeZone,
  LoadCountriesResponse,
  LoadCountryResponse,
  LoadTimeZonesResponse,
  ResponseError,
  GRAPHQL_ENDPOINT,
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
        locale: locale.replace(/-/, '_').toUpperCase(),
      },
    }),
  });

  const countries:
    | LoadCountriesResponse
    | ResponseError = await response.json();

  if (!('data' in countries) && 'errors' in countries) {
    throw new LoaderError(countries);
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
          locale: locale.replace(/-/, '_').toUpperCase(),
        },
      }),
    });

    const country: LoadCountryResponse = await response.json();

    if (!('data' in country) && 'errors' in country) {
      throw new LoaderError(country);
    }

    return country.data.country;
  },
);

export const loadTimeZones: (
  locale: string,
) => Promise<TimeZone[]> = memoizeAsync(async (locale: string) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      query,
      operationName: GraphqlOperationName.TimeZones,
      variables: {
        locale: locale.replace(/-/, '_').toUpperCase(),
      },
    }),
  });

  const timeZones:
    | LoadTimeZonesResponse
    | ResponseError = await response.json();

  if (!('data' in timeZones) && 'errors' in timeZones) {
    throw new LoaderError(timeZones);
  }

  return timeZones.data.timeZones;
});

class LoaderError extends Error {
  constructor(errors: ResponseError) {
    const errorMessage = errors.errors.map(error => error.message).join('; ');
    super(errorMessage);
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
