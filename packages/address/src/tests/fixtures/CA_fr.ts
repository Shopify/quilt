const data = {
  id: 'CA',
  type: 'country',
  attributes: {
    code: 'CA',
    zoneKey: 'province',
    zipKey: 'postalCode',
    format: {
      edit:
        '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
      show:
        '{firstName} {lastName}_{company}_{address1} {address2}_{city} {province} {zip}_{country}_{phone}',
    },
    name: 'Canada',
    provinces: [
      {code: 'AB', name: 'Alberta'},
      {code: 'BC', name: 'Colombie-Britannique'},
      {code: 'PE', name: 'Île-du-Prince-Édouard'},
      {code: 'MB', name: 'Manitoba'},
      {code: 'NB', name: 'Nouveau-Brunswick'},
      {code: 'NS', name: 'Nouvelle-Écosse'},
      {code: 'NU', name: 'Nunavut'},
      {code: 'ON', name: 'Ontario'},
      {code: 'QC', name: 'Québec'},
      {code: 'SK', name: 'Saskatchewan'},
      {code: 'NL', name: 'Terre-Neuve-et-Labrador'},
      {code: 'NT', name: 'Territoires du Nord-Ouest'},
      {code: 'YT', name: 'Yukon'},
    ],
  },
};

export default data;
