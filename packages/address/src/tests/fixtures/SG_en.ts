const data = {
  id: 'SG',
  type: 'country',
  attributes: {
    code: 'SG',
    zoneKey: 'region',
    zipKey: 'postalCode',
    address2Key: 'aptSuiteEtc',
    format: {
      edit:
        '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
      show:
        '{firstName} {lastName}_{company}_{address1} {address2}_{city} {zip}_{country}_{phone}',
    },
    name: 'Singapore',
    provinces: [],
  },
};

export default data;
