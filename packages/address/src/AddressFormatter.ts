import {Address, FieldName, Country} from './types';
import {renderLineTemplate, FIELDS_MAPPING} from './utilities';
import {loadCountry, loadCountries} from './loader';

const FIELD_REGEXP = /({\w+})/g;
const LINE_DELIMITER = '_';
const DEFAULT_FORM_LAYOUT =
  '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}';
const DEFAULT_SHOW_LAYOUT =
  '{lastName} {firstName}_{company}_{address1} {address2}_{city} {province} {zip}_{country}_{phone}';

const ORDERED_COUNTRIES_CACHE: {
  [locale: string]: Country[];
} = {};

const COUNTRIES_CACHE: {
  [locale: string]: {
    [countryCode: string]: Country;
  };
} = {};

export default class AddressFormatter {
  constructor(private locale: string) {
    this.locale = locale;
    COUNTRIES_CACHE[this.locale] = {};
  }

  updateLocale(locale: string) {
    this.locale = locale;
    COUNTRIES_CACHE[this.locale] = {};
  }

  async getCountry(countryCode: string): Promise<Country> {
    let country = this.loadCountryFromCache(countryCode);
    if (country) {
      return country;
    }

    country = await loadCountry(this.locale, countryCode);
    COUNTRIES_CACHE[this.locale][country.code] = country;

    return country;
  }

  async getCountries(): Promise<Country[]> {
    if (ORDERED_COUNTRIES_CACHE[this.locale]) {
      return ORDERED_COUNTRIES_CACHE[this.locale];
    }
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
    const layout = country.formatting.show || DEFAULT_SHOW_LAYOUT;
    return layout
      .split(LINE_DELIMITER)
      .map(fields => renderLineTemplate(country, fields, address).trim());
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

    const format = country ? country.formatting.edit : DEFAULT_FORM_LAYOUT;

    return format.split(LINE_DELIMITER).map(fields => {
      const result = fields.match(FIELD_REGEXP);
      if (!result) {
        return [];
      }
      return result.map(field => {
        return FIELDS_MAPPING[field];
      });
    });
  }

  async getTranslationKey(
    countryCode: string,
    key: FieldName,
  ): Promise<string> {
    const country = await this.getCountry(countryCode);

    switch (key) {
      case FieldName.Province:
        return country.provinceKey;
      case FieldName.Zip:
        return country.zipKey;
      case FieldName.Address2:
        return country.address2Key;
      default:
        return key;
    }
  }

  private loadCountryFromCache(
    countryCode: string,
  ): Country | undefined | null {
    const cachedCountry = COUNTRIES_CACHE[this.locale][countryCode];

    if (cachedCountry) {
      return cachedCountry;
    }

    if (ORDERED_COUNTRIES_CACHE[this.locale]) {
      return ORDERED_COUNTRIES_CACHE[this.locale].find(country => {
        return country.code === countryCode;
      });
    }

    return null;
  }
}
