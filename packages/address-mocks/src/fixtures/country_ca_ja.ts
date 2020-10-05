const data = {
  data: {
    country: {
      name: 'カナダ',
      code: 'CA',
      phoneNumberPrefix: 1,
      autocompletionField: 'address1',
      continent: 'North America',
      labels: {
        address1: '住所',
        address2: 'アパート、ユニット番号',
        city: '市区町村',
        company: '会社',
        country: '国',
        firstName: '名',
        lastName: '姓',
        phone: '電話番号',
        postalCode: '郵便番号',
        zone: '州',
      },
      optionalLabels: {
        address2: '建物名、部屋番号など (任意)',
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
