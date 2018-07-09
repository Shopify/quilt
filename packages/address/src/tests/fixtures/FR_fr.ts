const data = {
  id: 'FR',
  type: 'country',
  attributes: {
    code: 'FR',
    zoneKey: 'region',
    zipKey: 'postalCode',
    phoneNumberPrefix: 33,
    format: {
      edit:
        '{firstName}{lastName}_{company}_{address1}_{address2}_{country}{zip}{city}_{phone}',
      show:
        '{firstName} {lastName}_{company}_{address1} {address2}_{zip} {city}_{country}_{phone}',
    },
    name: 'France',
    provinces: [],
  },
};

export default data;
