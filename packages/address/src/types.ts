export enum FieldName {
  FirstName = 'firstName',
  LastName = 'lastName',
  Country = 'country',
  City = 'city',
  Zip = 'zip',
  Province = 'province',
  Address1 = 'address1',
  Address2 = 'address2',
  Phone = 'phone',
  Company = 'company',
}

export type ProvinceKey =
  | 'COUNTY'
  | 'EMIRATE'
  | 'GOVERNORATE'
  | 'PREFECTURE'
  | 'PROVINCE'
  | 'REGION'
  | 'STATE_AND_TERRITORY'
  | 'STATE';

export type ZipKey = 'POSTAL_CODE' | 'POSTCODE' | 'PINCODE' | 'ZIP_CODE';

export type Address2Key = 'APT_SUITE_ETC' | 'APT_UNIT_NUMBER';

export interface Address {
  company?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  // Province name
  province?: string | null;
  // Province code
  provinceCode?: string | null;
  zip: string | null;
  // Country name
  country: string | null;
  // Country code ISO 3166-1 alpha-2
  countryCode: string;
  phone?: string | null;
}

export interface Province {
  code: string;
  name: string;
}
export interface LoadCountriesResponse {
  data: {countries: Country[]};
}

export interface LoadCountryResponse {
  data: {country: Country};
}
export interface Country {
  name: string;
  code: string;
  phoneNumberPrefix: number;
  address2Key: Address2Key;
  provinceKey: ProvinceKey;
  zipKey: ZipKey;
  formatting: {
    edit: string;
    show: string;
  };
  provinces: Province[];
}

export interface ResponseError {
  errors: {
    locations: {
      column: number;
      line: number;
    }[];
    message: string;
    problems: {
      explanation: string;
    }[];
    value: any;
  }[];
}
