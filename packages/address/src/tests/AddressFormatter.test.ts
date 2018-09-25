import {fetch} from '@shopify/jest-dom-mocks';
import {Address, FieldName, SupportedLocale} from '../types';
import AddressFormatter from '..';
import {
  countriesJa,
  countriesEn,
  countryJpJa,
  countryJpEn,
  countryJpFr,
} from './fixtures';

const GRAPHQL_ENDPOINT = 'https://country-service.shopifycloud.com/graphql';

const address: Address = {
  company: 'Shopify',
  firstName: '恵子',
  lastName: '田中',
  address1: '八重洲1-5-3',
  address2: '',
  city: '目黒区',
  province: 'JP-13',
  zip: '100-8994',
  country: 'JP',
  phone: '514 xxx xxxx',
};

afterEach(fetch.restore);

function mockAPICall(
  operationName: string,
  fixture: any,
  locale: string = 'JA',
) {
  fetch.mock(
    (url, options) => {
      if (url !== GRAPHQL_ENDPOINT || options.method !== 'POST') {
        return false;
      }

      if (typeof options.body === 'string') {
        const body = JSON.parse(options.body);
        return (
          body.operationName === operationName &&
          body.variables.locale === locale
        );
      }

      return false;
    },
    fixture,
    {overwriteRoutes: false},
  );
}

describe('updateLocale()', () => {
  beforeEach(() => {
    mockAPICall('country', countryJpJa, 'JA');
    mockAPICall('country', countryJpEn, 'EN');
  });

  it('returns the country in the correct locale', async () => {
    const addressFormatter = new AddressFormatter('ja');
    let country = await addressFormatter.getCountry('JP');

    expect(country).toEqual(countryJpJa.data.country);

    addressFormatter.updateLocale('en');
    country = await addressFormatter.getCountry('JP');

    expect(country).toEqual(countryJpEn.data.country);
  });
});

describe('getCountry()', () => {
  it('returns a country', async () => {
    mockAPICall('country', countryJpJa);

    const addressFormatter = new AddressFormatter('ja');
    const country = await addressFormatter.getCountry('JP');

    expect(country).toEqual(countryJpJa.data.country);
  });

  it('should not call the API again for the same country if the locale is the same', async () => {
    mockAPICall('country', countryJpJa);

    const addressFormatter = new AddressFormatter('ja');
    await addressFormatter.getCountry('JP');
    await addressFormatter.getCountry('JP');

    expect(fetch.calls()).toHaveLength(1);
  });

  it('should call the API again for the same country if the locale changes', async () => {
    mockAPICall('country', countryJpJa);
    mockAPICall('country', countryJpEn, 'EN');

    const addressFormatter = new AddressFormatter('ja');
    await addressFormatter.getCountry('JP');

    expect(fetch.calls()).toHaveLength(1);

    addressFormatter.updateLocale('en');
    await addressFormatter.getCountry('JP');

    expect(fetch.calls()).toHaveLength(2);
  });

  it('should not call the API again for a country if all the countries have been loaded', async () => {
    mockAPICall('countries', countriesJa);
    mockAPICall('country', countryJpJa);

    const addressFormatter = new AddressFormatter('ja');
    await addressFormatter.getCountries();
    await addressFormatter.getCountry('JP');

    expect(fetch.calls()).toHaveLength(1);
  });

  it('should call the API again for a country in another locale even if all the countries have been loaded', async () => {
    mockAPICall('countries', countriesEn, 'EN');
    mockAPICall('country', countryJpFr, 'FR');

    const addressFormatter = new AddressFormatter('en');
    await addressFormatter.getCountries();
    addressFormatter.updateLocale('fr');
    await addressFormatter.getCountry('JP');

    expect(fetch.calls()).toHaveLength(2);
  });
});

describe('getCountries()', () => {
  it('returns all countries', async () => {
    mockAPICall('countries', countriesJa);

    const addressFormatter = new AddressFormatter('ja');
    const loadedCountries = await addressFormatter.getCountries();

    expect(loadedCountries).toEqual(countriesJa.data.countries);
  });

  it('should not call the API again for the countries if the locale is the same.', async () => {
    mockAPICall('countries', countriesEn, 'YY');
    // Bypass the cache by using a non existant locale
    const addressFormatter = new AddressFormatter('yy' as SupportedLocale);
    await addressFormatter.getCountries();
    await addressFormatter.getCountries();

    expect(fetch.calls()).toHaveLength(1);
  });

  it('should call the API again for the countries if the locale has been updated.', async () => {
    mockAPICall('countries', countriesEn, 'ZZ');
    mockAPICall('countries', countriesJa, 'XX');

    const addressFormatter = new AddressFormatter('zz' as SupportedLocale);
    await addressFormatter.getCountries();
    addressFormatter.updateLocale('xx' as SupportedLocale);
    await addressFormatter.getCountries();

    expect(fetch.calls()).toHaveLength(2);
  });
});

describe('format()', () => {
  beforeEach(() => {
    mockAPICall('country', countryJpJa, 'JA');
  });

  it('returns an array of parts of the address', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.format(address);

    expect(result).toEqual([
      '日本',
      '〒100-8994東京都目黒区八重洲1-5-3',
      'Shopify',
      '田中恵子様',
      '514 xxx xxxx',
    ]);
  });

  it('does not return {province} if the address does not have it', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.format({
      ...address,
      province: '',
    });

    expect(result).toEqual([
      '日本',
      '〒100-8994目黒区八重洲1-5-3',
      'Shopify',
      '田中恵子様',
      '514 xxx xxxx',
    ]);
  });
});

describe('getOrderedFields()', () => {
  beforeEach(() => {
    mockAPICall('country', countryJpJa, 'JA');
  });

  it('return fields ordered based on the country', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getOrderedFields('JP');

    expect(result).toMatchObject([
      ['company'],
      ['lastName', 'firstName'],
      ['zip'],
      ['country'],
      ['province', 'city'],
      ['address1'],
      ['address2'],
      ['phone'],
    ]);
  });
});

describe('getTranslationKey()', () => {
  beforeEach(() => {
    mockAPICall('country', countryJpJa, 'JA');
  });

  it('translates based on the country province key', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getTranslationKey(
      'JP',
      FieldName.Province,
    );

    expect(result).toBe('PREFECTURE');
  });

  it('translates based on the country zip key', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getTranslationKey(
      'JP',
      FieldName.Zip,
    );

    expect(result).toBe('POSTAL_CODE');
  });

  it('translates based on the country address2 key', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getTranslationKey(
      'JP',
      FieldName.Address2,
    );

    expect(result).toBe('APT_SUITE_ETC');
  });

  it('translates based on the country key', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getTranslationKey(
      'JP',
      FieldName.Country,
    );

    expect(result).toBe('country');
  });
});

describe('toSupportedLocale', () => {
  it('changes the lowercase locale to uppercase', async () => {
    mockAPICall('country', countryJpJa, 'ja');

    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getCountry('JP');

    expect(result).toEqual(countryJpJa.data.country);
  });

  it('replaces - with _ and returns the locale in uppercase', async () => {
    mockAPICall('country', countryJpJa, 'PT_BR');

    const addressFormatter = new AddressFormatter('pt-br' as SupportedLocale);
    const result = await addressFormatter.getCountry('JP');

    expect(result).toEqual(countryJpJa.data.country);
  });
});
