const data = {
  data: {
    country: {
      name: 'Canada',
      code: 'CA',
      phoneNumberPrefix: 1,
      autocompletionField: 'address1',
      continent: 'North America',
      labels: {
        address1: 'Address',
        address2: 'Apt./Unit No.',
        city: 'City',
        company: 'Company',
        country: 'Country',
        firstName: 'First name',
        lastName: 'Last name',
        phone: 'Phone',
        postalCode: 'Postal code',
        zone: 'Province',
      },
      optionalLabels: {
        address2: 'Apt./Unit No. (optional)',
      },
      formatting: {
        edit:
          '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
        show:
          '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province} {zip}_{country}_{phone}',
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
      provinceKey: 'PROVINCE',
    },
  },
};
export default data;
