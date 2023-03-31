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

  it('includes hidden zones when asked to', async () => {
    const india = await loadCountry('fr', 'IN', {includeHiddenZones: true});
    const mapped = india.zones.map((x) => x.code);
    expect(mapped).toContain('DH');
  });

  it('excludes hidden zones by default', async () => {
    const india = await loadCountry('en', 'IN');
    const mapped = india.zones.map((x) => x.code);
    expect(mapped).not.toContain('DH');
  });

  it('fetches a expected canada locale', async () => {
    const canada = await loadCountry('fr', 'CA');
    expect(canada.code).toBe('CA');
    expect(canada.zones[10].name).toBe('Terre-Neuve-et-Labrador');
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
