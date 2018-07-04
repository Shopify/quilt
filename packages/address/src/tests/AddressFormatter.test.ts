import {fetch} from '@shopify/jest-dom-mocks';
import {Address, FieldName} from '../types';
import AddressFormatter from '..';
import {JapanJa, FranceFr, CanadaEn, CanadaFr} from './fixtures';

const countries = [JapanJa, CanadaFr, FranceFr];

beforeEach(() => {
  fetch.mock(
    'https://country-service.shopifycloud.com/countries/JP?locale=ja',
    {data: JapanJa},
  );
});

afterEach(fetch.restore);

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

describe('updateLocale()', () => {
  beforeEach(() => {
    fetch.mock(
      'https://country-service.shopifycloud.com/countries/CA?locale=fr',
      {data: CanadaFr},
    );

    fetch.mock(
      'https://country-service.shopifycloud.com/countries/CA?locale=en',
      {data: CanadaEn},
    );
  });

  it('returns the country in the correct locale', async () => {
    const addressFormatter = new AddressFormatter('fr');
    let country = await addressFormatter.getCountry('CA');

    expect(country).toEqual(CanadaFr);

    addressFormatter.updateLocale('en');
    country = await addressFormatter.getCountry('CA');
    expect(country).toEqual(CanadaEn);
  });
});

describe('getCountry()', () => {
  it('returns a country', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const country = await addressFormatter.getCountry('JP');
    expect(country).toEqual(JapanJa);
  });

  it('loads country from cache if it was preloaded', async () => {
    const addressFormatter = new AddressFormatter('ja');
    let country = await addressFormatter.getCountry('JP');

    expect(country).toEqual(JapanJa);

    fetch.restore();
    fetch.mock(
      'https://country-service.shopifycloud.com/countries/JP?locale=ja',
      {data: 'lol'},
    );

    country = await addressFormatter.getCountry('JP');
    expect(country).toEqual(JapanJa);
  });

  it('loads country from cache if all the countries were loaded', async () => {
    fetch.restore();
    fetch.mock('https://country-service.shopifycloud.com/countries?locale=ja', {
      data: countries,
    });
    fetch.mock(
      'https://country-service.shopifycloud.com/countries/JP?locale=ja',
      {data: 'lol'},
    );

    const addressFormatter = new AddressFormatter('ja');
    await addressFormatter.getCountries();
    const country = await addressFormatter.getCountry('JP');

    expect(country).toEqual(JapanJa);
  });
});

describe('getCountries()', () => {
  beforeEach(() => {
    fetch.mock('https://country-service.shopifycloud.com/countries?locale=ja', {
      data: countries,
    });
  });

  it('returns all countries', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const loadedCountries = await addressFormatter.getCountries();
    expect(loadedCountries).toEqual(countries);
  });

  it('loads countries from cache', async () => {
    const addressFormatter = new AddressFormatter('ja');
    let loadedCountries = await addressFormatter.getCountries();

    expect(loadedCountries).toEqual(countries);

    fetch.restore();
    fetch.mock('https://country-service.shopifycloud.com/countries?locale=ja', {
      data: 'lol',
    });

    loadedCountries = await addressFormatter.getCountries();
    expect(loadedCountries).toEqual(countries);
  });
});

describe('format()', () => {
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
  it('translates based on the country province key', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getTranslationKey(
      'JP',
      FieldName.Province,
    );

    expect(result).toBe('prefecture');
  });

  it('translates based on the country zip key', async () => {
    const addressFormatter = new AddressFormatter('ja');
    const result = await addressFormatter.getTranslationKey(
      'JP',
      FieldName.Zip,
    );

    expect(result).toBe('postalCode');
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
