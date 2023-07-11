import type {Address, FieldName, Country} from '@shopify/address-consts';

import {formatAddress, buildOrderedFields} from './format';
import {loadCountry, loadCountries} from './loader';

const ORDERED_COUNTRIES_CACHE = new Map<string, Country[]>();

export default class AddressFormatter {
  /**
   * Useful in tests or any situation where the cache has undesirable
   * side-effects.
   */
  static resetCache() {
    ORDERED_COUNTRIES_CACHE.clear();
  }

  constructor(private locale: string) {
    this.locale = locale;
  }

  updateLocale(locale: string) {
    this.locale = locale;
  }

  async getCountry(
    countryCode: string,
    {includeHiddenZones = false} = {},
  ): Promise<Country> {
    const country = this.loadCountryFromCache(countryCode, includeHiddenZones);
    if (country) return country;

    return loadCountry(this.locale, countryCode, {includeHiddenZones});
  }

  async getCountries({includeHiddenZones = false} = {}): Promise<Country[]> {
    const cacheKey = this.cacheKey(this.locale, includeHiddenZones);
    const cachedCountries = ORDERED_COUNTRIES_CACHE.get(cacheKey);

    if (cachedCountries) return cachedCountries;

    const countries = await loadCountries(this.locale, {includeHiddenZones});
    ORDERED_COUNTRIES_CACHE.set(cacheKey, countries);

    return countries;
  }

  async getZoneName(
    countryCode: string,
    zoneCode: string,
  ): Promise<string | undefined> {
    const country = await this.getCountry(countryCode);
    const countryZone = country.zones.find((item) => item.code === zoneCode);
    if (!countryZone?.name) return undefined;

    return countryZone.name;
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

  private cacheKey(locale: string, includeHiddenZones: boolean) {
    /* Cache list of countries per locale, both with and without hidden zones included */
    return `${locale}-${includeHiddenZones}`;
  }

  private loadCountryFromCache(
    countryCode: string,
    includeHiddenZones: boolean,
  ) {
    const cachedCountries = ORDERED_COUNTRIES_CACHE.get(
      this.cacheKey(this.locale, includeHiddenZones),
    );
    if (!cachedCountries) return null;

    return cachedCountries.find(({code}) => code === countryCode);
  }
}
