import {allLocales, faker} from '@faker-js/faker';

import {combinedI18nDetails} from '../utilities';

describe('combinedI18nDetails()', () => {
  it('merges two details objects together', () => {
    const details = {
      locale: faker.helpers.objectKey(allLocales),
      country: faker.location.country(),
    };
    const overrides = {
      currency: faker.finance.currencyCode(),
    };

    const combinedDetails = combinedI18nDetails(details, overrides);

    expect(combinedDetails).toHaveProperty('locale');
    expect(combinedDetails).toHaveProperty('country');
    expect(combinedDetails).toHaveProperty('currency');
  });

  it('overrides fields with defined overrides', () => {
    const locale = faker.helpers.objectKey(allLocales);
    const country = faker.location.country();
    const currency = faker.finance.currencyCode();
    const details = {
      locale,
      country,
      currency,
    };
    const overrideCurrency = faker.finance.currencyCode();
    const overrides = {
      locale: undefined,
      country: undefined,
      currency: overrideCurrency,
    };

    const combinedDetails = combinedI18nDetails(details, overrides);

    expect(combinedDetails).toHaveProperty('locale', locale);
    expect(combinedDetails).toHaveProperty('country', country);
    expect(combinedDetails).toHaveProperty('currency', overrideCurrency);
  });

  describe('locale', () => {
    it('returns a details object with a locale field', () => {
      const locale = faker.helpers.objectKey(allLocales);
      const fallbackLocale = faker.helpers.objectKey(allLocales);
      const details = {locale};
      const overrides = {locale: undefined, fallbackLocale};

      expect(combinedI18nDetails(details, overrides)).toHaveProperty(
        'locale',
        locale,
      );
    });

    it('favours an override locale if one is specified', () => {
      const locale = faker.helpers.objectKey(allLocales);
      const overrideLocale = faker.helpers.objectKey(allLocales);
      const details = {locale};
      const overrides = {locale: overrideLocale};

      expect(combinedI18nDetails(details, overrides)).toHaveProperty(
        'locale',
        overrideLocale,
      );
    });

    it('returns a details object with a fallback locale field if one is specified', () => {
      const fallbackLocale = faker.helpers.objectKey(allLocales);
      const details = {};
      const overrides = {fallbackLocale};

      expect(combinedI18nDetails(details, overrides)).toHaveProperty(
        'locale',
        fallbackLocale,
      );
    });

    it('returns a details object with a default locale field if none is specified', () => {
      const details = {};
      const overrides = {};

      expect(combinedI18nDetails(details, overrides)).toHaveProperty(
        'locale',
        'en',
      );
    });
  });
});
