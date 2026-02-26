import {Country} from './types';

const API_VERSION = '1';
const API_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'API-VERSION': API_VERSION,
};
const COUNTRY_SERVICE_URL = 'https://country-service.shopifycloud.com';

export async function loadCountries(locale: string): Promise<Country[]> {
  const countries = await fetch(
    `${COUNTRY_SERVICE_URL}/countries?locale=${locale}`,
    {
      cache: 'force-cache',
      headers: API_HEADERS,
    },
  );

  const jsonResponse = await countries.json();

  return jsonResponse.data;
}

export async function loadCountry(
  locale: string,
  countryCode: string,
): Promise<Country> {
  const country = await fetch(
    `${COUNTRY_SERVICE_URL}/countries/${countryCode}?locale=${locale}`,
    {
      cache: 'force-cache',
      headers: API_HEADERS,
    },
  );

  const jsonResponse = await country.json();
  return jsonResponse.data;
}
