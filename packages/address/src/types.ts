export enum FieldName {
  FirstName = 'firstName',
  LastName = 'lastName',
  Country = 'country',
  City = 'city',
  PostalCode = 'zip',
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

export interface Zone {
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
  autocompletionField: string;
  provinceKey: ZoneKey;
  labels: {
    address1: string;
    address2: string;
    city: string;
    company: string;
    country: string;
    firstName: string;
    lastName: string;
    phone: string;
    postalCode: string;
    zone: string;
  };
  formatting: {
    edit: string;
    show: string;
  };
  zones: Zone[];
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
