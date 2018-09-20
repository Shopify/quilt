import {
  Country,
  LoadCountriesResponse,
  LoadCountryResponse,
  ResponseError,
} from './types';
import query from './graphqlQuery';

const GRAPHQL_ENDPOINT = 'https://country-service.shopifycloud.com/graphql';
enum GRAPHAL_OPERATION_NAMES {
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
      operationName: GRAPHAL_OPERATION_NAMES.countries,
      variables: {
        locale,
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
      operationName: GRAPHAL_OPERATION_NAMES.country,
      variables: {
        countryCode,
        locale,
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
