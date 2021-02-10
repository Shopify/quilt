import {
  LoadCountriesResponse,
  LoadCountryResponse,
  LoadTimeZonesResponse,
} from '@shopify/address-consts';

const countryCAFr: LoadCountryResponse = require('./country_ca_fr').default;
const countryCAEn: LoadCountryResponse = require('./country_ca_en').default;
const countryCAJa: LoadCountryResponse = require('./country_ca_ja').default;
const countryCAAf: LoadCountryResponse = require('./country_ca_af').default;
const countriesEn: LoadCountriesResponse = require('./countries_en').default;
const countriesJa: LoadCountriesResponse = require('./countries_ja').default;
const countriesAF: LoadCountriesResponse = require('./countries_af').default;
const timeZonesEn: LoadTimeZonesResponse = require('./timezones_en').default;
const timeZonesFr: LoadTimeZonesResponse = require('./timezones_fr').default;
const timeZonesJa: LoadTimeZonesResponse = require('./timezones_ja').default;

interface Fixtures {
  countries: {
    [key: string]: LoadCountriesResponse;
  };
  country: {
    [key: string]: LoadCountryResponse;
  };
  timeZones: {
    [key: string]: LoadTimeZonesResponse;
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
  timeZones: {
    AF: timeZonesEn,
    DA: timeZonesEn,
    DE: timeZonesEn,
    EN: timeZonesEn,
    ES: timeZonesEn,
    FR: timeZonesFr,
    IT: timeZonesEn,
    JA: timeZonesJa,
    NL: timeZonesEn,
    PT: timeZonesEn,
    PT_BR: timeZonesEn,
  },
};
