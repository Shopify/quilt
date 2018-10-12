import {
  Country,
  LoadCountriesResponse,
  LoadCountryResponse,
  ResponseError,
} from './types';
import query from './graphqlQuery';

export const GRAPHQL_ENDPOINT =
  'https://country-service.shopifycloud.com/graphql';
export enum GRAPHQL_OPERATION_NAMES {
  countries = 'countries',
  country = 'country',
}

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export async function loadCountries(locale: string): Promise<Country[]> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      query,
      operationName: GRAPHQL_OPERATION_NAMES.countries,
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
  } else {
    return countries.data.countries;
  }
}

export async function loadCountry(
  locale: string,
  countryCode: string,
): Promise<Country> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      query,
      operationName: GRAPHQL_OPERATION_NAMES.country,
      variables: {
        countryCode,
        locale: toSupportedLocale(locale),
      },
    }),
  });
  const country: LoadCountryResponse = await response.json();
  if ('errors' in country) {
    throw new CountryLoaderError(country);
  } else {
    return country.data.country;
  }
}

class CountryLoaderError extends Error {
  constructor(errors: ResponseError) {
    const errorMessage = errors.errors.map(error => error.message).join('; ');
    super(errorMessage);
  }
}

const DEFAULT_LOCALE = 'EN';
export const SUPPORTED_LOCALES = [
  'DA',
  'DE',
  'EN',
  'ES',
  'FR',
  'IT',
  'JA',
  'NL',
  'PT',
  'PT_BR',
];

export function toSupportedLocale(locale: string) {
  const supportedLocale = locale.replace(/-/, '_').toUpperCase();

  if (SUPPORTED_LOCALES.includes(supportedLocale)) {
    return supportedLocale;
  } else {
    return DEFAULT_LOCALE;
  }
}
