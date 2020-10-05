import {fetch} from '@shopify/jest-dom-mocks';
import {Address} from '@shopify/address-consts';
import {mockCountryRequests} from '@shopify/address-mocks';

import AddressFormatter from '../AddressFormatter';

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

describe('AddressFormatter', () => {
  beforeEach(() => mockCountryRequests());
  afterEach(() => fetch.restore());

  describe('updateLocale()', () => {
    it('returns the country information in the default locale for that country', async () => {
      const addressFormatter = new AddressFormatter('ja');
      let country = await addressFormatter.getCountry('CA');

      expect(country.name).toStrictEqual('カナダ');

      addressFormatter.updateLocale('en');
      country = await addressFormatter.getCountry('CA');

      expect(country.name).toStrictEqual('Canada');
    });
  });

  describe('getCountry()', () => {
    it('returns a country object', async () => {
      const addressFormatter = new AddressFormatter('ja');
      const country = await addressFormatter.getCountry('JP');

      expect(Object.keys(country)).toStrictEqual([
        'name',
        'code',
        'phoneNumberPrefix',
        'autocompletionField',
        'continent',
        'labels',
        'optionalLabels',
        'formatting',
        'zones',
        'provinceKey',
      ]);
    });

    it('returns a country object in en if locale is not available', async () => {
      const addressFormatter = new AddressFormatter('af');
      const country = await addressFormatter.getCountry('CA');

      expect(country.name).toStrictEqual('Canada');
    });

    it('does not call the API again for the same country if the locale is the same', async () => {
      const addressFormatter = new AddressFormatter('pt-br');

      await addressFormatter.getCountry('CA');
      await addressFormatter.getCountry('CA');

      expect(fetch.calls()).toHaveLength(1);
    });

    it('does call the API again for the same country if the locale changes', async () => {
      const addressFormatter = new AddressFormatter('fr');
      await addressFormatter.getCountry('CA');

      expect(fetch.calls()).toHaveLength(1);

      addressFormatter.updateLocale('es');
      await addressFormatter.getCountry('CA');

      expect(fetch.calls()).toHaveLength(2);
    });

    it('does not call the API again for a country if all the countries have been loaded', async () => {
      const addressFormatter = new AddressFormatter('ja');
      await addressFormatter.getCountries();
      await addressFormatter.getCountry('JP');

      expect(fetch.calls()).toHaveLength(1);
    });

    it('does call the API again for a country in another locale even if all the countries have been loaded', async () => {
      const addressFormatter = new AddressFormatter('en');
      await addressFormatter.getCountries();
      addressFormatter.updateLocale('fr');
      await addressFormatter.getCountry('JP');

      expect(fetch.calls()).toHaveLength(2);
    });
  });

  describe('getCountries()', () => {
    it('returns all countries', async () => {
      const addressFormatter = new AddressFormatter('ja');
      const loadedCountries = await addressFormatter.getCountries();

      expect(loadedCountries).toHaveLength(242);
    });

    it('returns all countries in en if locale is not available', async () => {
      const addressFormatter = new AddressFormatter('af');
      const loadedCountries = await addressFormatter.getCountries();

      expect(loadedCountries[0].name).toStrictEqual('Afghanistan');
    });

    it('does not call the API again for the countries if the locale is the same.', async () => {
      // Bypass the cache by using a non existant locale
      const addressFormatter = new AddressFormatter('pt-br');
      await addressFormatter.getCountries();
      await addressFormatter.getCountries();

      expect(fetch.calls()).toHaveLength(1);
    });

    it('does call the API again for the countries if the locale has been updated.', async () => {
      const addressFormatter = new AddressFormatter('nl');
      await addressFormatter.getCountries();
      addressFormatter.updateLocale('it');
      await addressFormatter.getCountries();

      expect(fetch.calls()).toHaveLength(2);
    });
  });

  describe('format()', () => {
    it('returns an array of parts of the address', async () => {
      const addressFormatter = new AddressFormatter('ja');
      const result = await addressFormatter.format(address);

      expect(result).toStrictEqual([
        '日本',
        '〒100-8994 東京都 目黒区 八重洲1-5-3',
        'Shopify',
        '田中 恵子様',
        '514 xxx xxxx',
      ]);
    });

    it('does not return {province} if the address does not have it', async () => {
      const addressFormatter = new AddressFormatter('ja');
      const result = await addressFormatter.format({
        ...address,
        province: '',
      });

      expect(result).toStrictEqual([
        '日本',
        '〒100-8994 目黒区 八重洲1-5-3',
        'Shopify',
        '田中 恵子様',
        '514 xxx xxxx',
      ]);
    });
  });

  describe('getOrderedFields()', () => {
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
});
