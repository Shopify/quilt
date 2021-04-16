import {Address, FieldName, Country} from '@shopify/address-consts';

import {formatAddress, buildOrderedFields} from './format';
import {loadCountry, loadCountries} from './loader';

const ORDERED_COUNTRIES_CACHE: {
  [locale: string]: Country[];
} = {};

export default class AddressFormatter {
  constructor(private locale: string) {
    this.locale = locale;
  }

  updateLocale(locale: string) {
    this.locale = locale;
  }

  async getCountry(countryCode: string): Promise<Country> {
    let country = this.loadCountryFromCache(countryCode);
    if (country) {
      return country;
    }

    country = await loadCountry(this.locale, countryCode);

    return country;
  }

  async getCountries(): Promise<Country[]> {
    const countries = await loadCountries(this.locale);
    ORDERED_COUNTRIES_CACHE[this.locale] = countries;

    return countries;
  }

  /* Returns the address ordered in an array based based on the country code
   * Eg.:
   *   [
   *     'Shopify',
   *     'First Name Last Name',
   *     'Address 1',
   *     'address2',
   *     'Montréal',
   *     'Canada Quebec H2J 4B7',
   *     '514 444 3333'
   *   ]
   */
  async format(address: Address): Promise<string[]> {
    const country = await this.getCountry(address.country);
    return formatAddress(address, country);
  }

  /* Returns an array that shows how to order fields based on the country code
   * Eg.:
   *   [
   *     ['company'],
   *     ['firstName', 'lastName'],
   *     ['address1'],
   *     ['address2'],
   *     ['city'],
   *     ['country', 'province', 'zip'],
   *     ['phone']
   *   ]
   */
  async getOrderedFields(countryCode: string): Promise<FieldName[][]> {
    const country = await this.getCountry(countryCode);

    return buildOrderedFields(country);
  }

  private loadCountryFromCache(
    countryCode: string,
  ): Country | undefined | null {
    if (ORDERED_COUNTRIES_CACHE[this.locale]) {
      return ORDERED_COUNTRIES_CACHE[this.locale].find((country) => {
        return country.code === countryCode;
      });
    }

    return null;
  }
}
