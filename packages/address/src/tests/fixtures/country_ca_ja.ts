const data = {
  data: {
    country: {
      name: 'カナダ',
      code: 'CA',
      phoneNumberPrefix: 1,
      address2Key: 'APT_UNIT_NUMBER',
      provinceKey: 'PROVINCE',
      zipKey: 'POSTAL_CODE',
      formatting: {
        edit:
          '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
        show:
          '{firstName} {lastName}_{company}_{address1} {address2}_{city} {province} {zip}_{country}_{phone}',
      },
      provinces: [
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
  },
};
export default data;
