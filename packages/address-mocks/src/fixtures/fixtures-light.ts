import type {Fixtures} from '../types';

import countryCAEn from './country_ca_en';

const fixturesLight: Fixtures = {
  countries: {
    EN: {
      data: {
        countries: [
          {
            name: 'Canada',
            code: 'CA',
            continent: 'North America',
            phoneNumberPrefix: 1,
            autocompletionField: 'address1',
            provinceKey: 'PROVINCE',
            labels: {
              address1: 'Address',
              address2: 'Apartment, suite, etc.',
              city: 'City',
              company: 'Company',
              country: 'Country/Region',
              firstName: 'First name',
              lastName: 'Last name',
              phone: 'Phone',
              postalCode: 'Postal code',
              zone: 'Province',
            },
            optionalLabels: {
              address2: 'Apartment, suite, etc. (optional)',
            },
            formatting: {
              edit: '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
              show: '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province} {zip}_{country}_{phone}',
            },
            zones: [
              {
                name: 'Alberta',
                code: 'AB',
              },
              {
                name: 'British Columbia',
                code: 'BC',
              },
              {
                name: 'Manitoba',
                code: 'MB',
              },
              {
                name: 'New Brunswick',
                code: 'NB',
              },
              {
                name: 'Newfoundland and Labrador',
                code: 'NL',
              },
              {
                name: 'Northwest Territories',
                code: 'NT',
              },
              {
                name: 'Nova Scotia',
                code: 'NS',
              },
              {
                name: 'Nunavut',
                code: 'NU',
              },
              {
                name: 'Ontario',
                code: 'ON',
              },
              {
                name: 'Prince Edward Island',
                code: 'PE',
              },
              {
                name: 'Quebec',
                code: 'QC',
              },
              {
                name: 'Saskatchewan',
                code: 'SK',
              },
              {
                name: 'Yukon',
                code: 'YT',
              },
            ],
          },
        ],
      },
    },
  },
  country: {
    EN: countryCAEn,
  },
};

export default fixturesLight;
