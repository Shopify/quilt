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
    AF: countriesAF as LoadCountriesResponse,
    DA: countriesEn as LoadCountriesResponse,
    DE: countriesEn as LoadCountriesResponse,
    EN: countriesEn as LoadCountriesResponse,
    ES: countriesEn as LoadCountriesResponse,
    FR: countriesEn as LoadCountriesResponse,
    IT: countriesEn as LoadCountriesResponse,
    JA: countriesJa as LoadCountriesResponse,
    NL: countriesEn as LoadCountriesResponse,
    PT: countriesEn as LoadCountriesResponse,
    PT_BR: countriesEn as LoadCountriesResponse,
  },
  country: {
    AF: countryCAAf as LoadCountryResponse,
    DA: countryCAEn as LoadCountryResponse,
    DE: countryCAEn as LoadCountryResponse,
    EN: countryCAEn as LoadCountryResponse,
    ES: countryCAEn as LoadCountryResponse,
    FR: countryCAFr as LoadCountryResponse,
    IT: countryCAEn as LoadCountryResponse,
    JA: countryCAJa as LoadCountryResponse,
    NL: countryCAEn as LoadCountryResponse,
    PT: countryCAEn as LoadCountryResponse,
    PT_BR: countryCAEn as LoadCountryResponse,
  },
};
