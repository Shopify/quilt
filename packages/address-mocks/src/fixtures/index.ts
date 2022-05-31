import {
  LoadCountriesResponse,
  LoadCountryResponse,
} from '@shopify/address-consts';

import countryCAFr from './country_ca_fr';
import countryCAEn from './country_ca_en';
import countryCAJa from './country_ca_ja';
import countryCAAf from './country_ca_af';
import countriesEn from './countries_en';
import countriesJa from './countries_ja';
import countriesAF from './countries_af';
import countriesFR from './countries_fr';

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
    FR: countriesFR,
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
