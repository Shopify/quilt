import {mockCountryRequests} from '@shopify/address-mocks';
import {fetch} from '@shopify/jest-dom-mocks';

import {CountryLoaderError, loadCountries, loadCountry} from '../loader';

describe('mockCountryRequests', () => {
  beforeEach(() => {
    mockCountryRequests();
  });

  afterEach(() => fetch.restore());

  it('fetches a country fixture', async () => {
    const japan = await loadCountry('ja', 'JP');
    expect(japan.code).toBe('JP');
  });

  it('fetches a countries fixture', async () => {
    const [firstCountry] = await loadCountries('ja');
    expect(firstCountry.name).toBe('アイスランド');
  });

  it('fails to fetch invalid country code', async () => {
    await expect(
      loadCountry('ja', 'invalid-country-code'),
    ).rejects.toBeInstanceOf(CountryLoaderError);
  });

  it('fails to fetch invalid locale code', async () => {
    await expect(loadCountry('invalid-locale', 'CA')).rejects.toBeInstanceOf(
      CountryLoaderError,
    );
  });
});
