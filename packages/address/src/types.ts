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

export interface Country {
  id: string;
  type: string;
  attributes: {
    code: string;
    name: string;
    format: {
      edit: string;
      show: string;
    };
    zoneKey: string;
    zipKey: string;
    provinces: Province[];
  };
}
