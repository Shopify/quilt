import type {
  LoadCountriesResponse,
  LoadCountryResponse,
} from '@shopify/address-consts';

export interface Fixtures {
  countries: {
    [key: string]: LoadCountriesResponse;
  };
  country: {
    [key: string]: LoadCountryResponse;
  };
}

export interface MockOptions {
  overwriteRoutes?: boolean;
}
