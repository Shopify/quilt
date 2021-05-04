import {
  LoadCountriesResponse,
  LoadCountryResponse,
} from '@shopify/address-consts';

/* eslint-disable @typescript-eslint/no-var-requires */
const countryCAFr: LoadCountryResponse = require('./country_ca_fr').default;
const countryCAEn: LoadCountryResponse = require('./country_ca_en').default;
const countryCAJa: LoadCountryResponse = require('./country_ca_ja').default;
const countryCAAf: LoadCountryResponse = require('./country_ca_af').default;
const countriesEn: LoadCountriesResponse = require('./countries_en').default;
const countriesJa: LoadCountriesResponse = require('./countries_ja').default;
const countriesAF: LoadCountriesResponse = require('./countries_af').default;
/* eslint-enable @typescript-eslint/no-var-requires */

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
    AF: countriesAF,
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
    AF: countryCAAf,
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
