const data = {
  data: {
    country: {
      name: 'Canada',
      code: 'CA',
      phoneNumberPrefix: 1,
      autocompletionField: 'address1',
      continent: 'North America',
      labels: {
        address1: 'Adresse',
        address2: "N° d'appt/unité",
        city: 'Ville',
        company: 'Entreprise',
        country: 'Pays',
        firstName: 'Prénom',
        lastName: 'Nom',
        phone: 'Téléphone',
        postalCode: 'Code postal',
        zone: 'Province',
      },
      optionalLabels: {
        address2: 'Appartement, suite, etc. (facultatif)',
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
          name: 'Colombie-Britannique',
          code: 'BC',
        },
        {
          name: 'Île-du-Prince-Édouard',
          code: 'PE',
        },
        {
          name: 'Manitoba',
          code: 'MB',
        },
        {
          name: 'Nouveau-Brunswick',
          code: 'NB',
        },
        {
          name: 'Nouvelle-Écosse',
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
          name: 'Québec',
          code: 'QC',
        },
        {
          name: 'Saskatchewan',
          code: 'SK',
        },
        {
          name: 'Terre-Neuve-et-Labrador',
          code: 'NL',
        },
        {
          name: 'Territoires du Nord-Ouest',
          code: 'NT',
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
