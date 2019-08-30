import {
  LoadCountriesResponse,
  LoadCountryResponse,
} from '@shopify/address-consts';

const countryCAFr: LoadCountryResponse = require('./country_ca_fr').default;
const countryCAEn: LoadCountryResponse = require('./country_ca_en').default;
const countryCAJa: LoadCountryResponse = require('./country_ca_ja').default;

const countriesEn: LoadCountriesResponse = require('./countries_en').default;
const countriesJa: LoadCountriesResponse = require('./countries_ja').default;

interface Fixtures {
  countries: {
    [key: string]: LoadCountriesResponse;
  };
  country: {
    [key: string]: LoadCountryResponse;
  };
}

export const fixtures: Fixtures = {
  countries: {
    DA: countriesEn,
    DE: countriesEn,
    EN: countriesEn,
    ES: countriesEn,
    FR: countriesEn,
    IT: countriesEn,
    JA: countriesJa,
    NL: countriesEn,
    PT: countriesEn,
    PT_BR: countriesEn,
  },
  country: {
    DA: countryCAEn,
    DE: countryCAEn,
    EN: countryCAEn,
    ES: countryCAEn,
    FR: countryCAFr,
    IT: countryCAEn,
    JA: countryCAJa,
    NL: countryCAEn,
    PT: countryCAEn,
    PT_BR: countryCAEn,
  },
};
