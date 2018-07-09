const data = {
  id: 'CA',
  type: 'country',
  attributes: {
    code: 'CA',
    zoneKey: 'province',
    zipKey: 'postalCode',
    phoneNumberPrefix: 1,
    format: {
      edit:
        '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
      show:
        '{firstName} {lastName}_{company}_{address1} {address2}_{city} {province} {zip}_{country}_{phone}',
    },
    name: 'Canada',
    provinces: [
      {code: 'AB', name: 'Alberta'},
      {code: 'BC', name: 'British Columbia'},
      {code: 'MB', name: 'Manitoba'},
      {code: 'NB', name: 'New Brunswick'},
      {code: 'NL', name: 'Newfoundland'},
      {code: 'NT', name: 'Northwest Territories'},
      {code: 'NS', name: 'Nova Scotia'},
      {code: 'NU', name: 'Nunavut'},
      {code: 'ON', name: 'Ontario'},
      {code: 'PE', name: 'Prince Edward Island'},
      {code: 'QC', name: 'Quebec'},
      {code: 'SK', name: 'Saskatchewan'},
      {code: 'YT', name: 'Yukon'},
    ],
  },
};

export default data;
