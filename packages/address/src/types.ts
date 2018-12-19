export enum FieldName {
  FirstName = 'firstName',
  LastName = 'lastName',
  Country = 'country',
  City = 'city',
  Zip = 'zip',
  Zone = 'province',
  Address1 = 'address1',
  Address2 = 'address2',
  Phone = 'phone',
  Company = 'company',
}

export type ZoneKey =
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
  company?: string;
  firstName?: string;
  lastName?: string;
  address1: string;
  address2: string;
  city: string;
  province?: string;
  zip: string;
  // Country code ISO 3166-1 alpha-2
  country: string;
  phone?: string;
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
  continent: string;
  phoneNumberPrefix: number;
  address2Key: Address2Key;
  provinceKey: ZoneKey;
  zipKey: ZipKey;
  formatting: {
    edit: string;
    show: string;
  };
  zones: Province[];
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
