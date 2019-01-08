const data = {
  data: {
    countries: [
      {
        name: 'アイスランド',
        code: 'IS',
        phoneNumberPrefix: 354,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'アイルランド',
        code: 'IE',
        phoneNumberPrefix: 353,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'COUNTY',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Carlow',
            code: 'CW',
          },
          {
            name: 'Cavan',
            code: 'CN',
          },
          {
            name: 'Clare',
            code: 'CE',
          },
          {
            name: 'Cork',
            code: 'CO',
          },
          {
            name: 'Donegal',
            code: 'DL',
          },
          {
            name: 'Dublin',
            code: 'D',
          },
          {
            name: 'Galway',
            code: 'G',
          },
          {
            name: 'Kerry',
            code: 'KY',
          },
          {
            name: 'Kildare',
            code: 'KE',
          },
          {
            name: 'Kilkenny',
            code: 'KK',
          },
          {
            name: 'Laois',
            code: 'LS',
          },
          {
            name: 'Leitrim',
            code: 'LM',
          },
          {
            name: 'Limerick',
            code: 'LK',
          },
          {
            name: 'Longford',
            code: 'LD',
          },
          {
            name: 'Louth',
            code: 'LH',
          },
          {
            name: 'Mayo',
            code: 'MO',
          },
          {
            name: 'Meath',
            code: 'MH',
          },
          {
            name: 'Monaghan',
            code: 'MN',
          },
          {
            name: 'Offaly',
            code: 'OY',
          },
          {
            name: 'Roscommon',
            code: 'RN',
          },
          {
            name: 'Sligo',
            code: 'SO',
          },
          {
            name: 'Tipperary',
            code: 'TA',
          },
          {
            name: 'Waterford',
            code: 'WD',
          },
          {
            name: 'Westmeath',
            code: 'WH',
          },
          {
            name: 'Wexford',
            code: 'WX',
          },
          {
            name: 'Wicklow',
            code: 'WW',
          },
        ],
        continent: 'Europe',
      },
      {
        name: 'アゼルバイジャン',
        code: 'AZ',
        phoneNumberPrefix: 994,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'アフガニスタン',
        code: 'AF',
        phoneNumberPrefix: 93,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'アメリカ合衆国',
        code: 'US',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'ZIP_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Alabama',
            code: 'AL',
          },
          {
            name: 'Alaska',
            code: 'AK',
          },
          {
            name: 'American Samoa',
            code: 'AS',
          },
          {
            name: 'Arizona',
            code: 'AZ',
          },
          {
            name: 'Arkansas',
            code: 'AR',
          },
          {
            name: 'California',
            code: 'CA',
          },
          {
            name: 'Colorado',
            code: 'CO',
          },
          {
            name: 'Connecticut',
            code: 'CT',
          },
          {
            name: 'Delaware',
            code: 'DE',
          },
          {
            name: 'District of Columbia',
            code: 'DC',
          },
          {
            name: 'Federated States of Micronesia',
            code: 'FM',
          },
          {
            name: 'Florida',
            code: 'FL',
          },
          {
            name: 'Georgia',
            code: 'GA',
          },
          {
            name: 'Guam',
            code: 'GU',
          },
          {
            name: 'Hawaii',
            code: 'HI',
          },
          {
            name: 'Idaho',
            code: 'ID',
          },
          {
            name: 'Illinois',
            code: 'IL',
          },
          {
            name: 'Indiana',
            code: 'IN',
          },
          {
            name: 'Iowa',
            code: 'IA',
          },
          {
            name: 'Kansas',
            code: 'KS',
          },
          {
            name: 'Kentucky',
            code: 'KY',
          },
          {
            name: 'Louisiana',
            code: 'LA',
          },
          {
            name: 'Maine',
            code: 'ME',
          },
          {
            name: 'Marshall Islands',
            code: 'MH',
          },
          {
            name: 'Maryland',
            code: 'MD',
          },
          {
            name: 'Massachusetts',
            code: 'MA',
          },
          {
            name: 'Michigan',
            code: 'MI',
          },
          {
            name: 'Minnesota',
            code: 'MN',
          },
          {
            name: 'Mississippi',
            code: 'MS',
          },
          {
            name: 'Missouri',
            code: 'MO',
          },
          {
            name: 'Montana',
            code: 'MT',
          },
          {
            name: 'Nebraska',
            code: 'NE',
          },
          {
            name: 'Nevada',
            code: 'NV',
          },
          {
            name: 'New Hampshire',
            code: 'NH',
          },
          {
            name: 'New Jersey',
            code: 'NJ',
          },
          {
            name: 'New Mexico',
            code: 'NM',
          },
          {
            name: 'New York',
            code: 'NY',
          },
          {
            name: 'North Carolina',
            code: 'NC',
          },
          {
            name: 'North Dakota',
            code: 'ND',
          },
          {
            name: 'Northern Mariana Islands',
            code: 'MP',
          },
          {
            name: 'Ohio',
            code: 'OH',
          },
          {
            name: 'Oklahoma',
            code: 'OK',
          },
          {
            name: 'Oregon',
            code: 'OR',
          },
          {
            name: 'Palau',
            code: 'PW',
          },
          {
            name: 'Pennsylvania',
            code: 'PA',
          },
          {
            name: 'Puerto Rico',
            code: 'PR',
          },
          {
            name: 'Rhode Island',
            code: 'RI',
          },
          {
            name: 'South Carolina',
            code: 'SC',
          },
          {
            name: 'South Dakota',
            code: 'SD',
          },
          {
            name: 'Tennessee',
            code: 'TN',
          },
          {
            name: 'Texas',
            code: 'TX',
          },
          {
            name: 'Utah',
            code: 'UT',
          },
          {
            name: 'Vermont',
            code: 'VT',
          },
          {
            name: 'Virgin Islands',
            code: 'VI',
          },
          {
            name: 'Virginia',
            code: 'VA',
          },
          {
            name: 'Washington',
            code: 'WA',
          },
          {
            name: 'West Virginia',
            code: 'WV',
          },
          {
            name: 'Wisconsin',
            code: 'WI',
          },
          {
            name: 'Wyoming',
            code: 'WY',
          },
          {
            name: 'Armed Forces Americas',
            code: 'AA',
          },
          {
            name: 'Armed Forces Europe',
            code: 'AE',
          },
          {
            name: 'Armed Forces Pacific',
            code: 'AP',
          },
        ],
        continent: 'North America',
      },
      {
        name: 'アラブ首長国連邦',
        code: 'AE',
        phoneNumberPrefix: 971,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'EMIRATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Abu Dhabi',
            code: 'AZ',
          },
          {
            name: 'Ajman',
            code: 'AJ',
          },
          {
            name: 'Dubai',
            code: 'DU',
          },
          {
            name: 'Fujairah',
            code: 'FU',
          },
          {
            name: 'Ras al-Khaimah',
            code: 'RK',
          },
          {
            name: 'Sharjah',
            code: 'SH',
          },
          {
            name: 'Umm al-Quwain',
            code: 'UQ',
          },
        ],
        continent: 'Asia',
      },
      {
        name: 'アルジェリア',
        code: 'DZ',
        phoneNumberPrefix: 213,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'アルゼンチン',
        code: 'AR',
        phoneNumberPrefix: 54,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Buenos Aires',
            code: 'B',
          },
          {
            name: 'Catamarca',
            code: 'K',
          },
          {
            name: 'Chaco',
            code: 'H',
          },
          {
            name: 'Chubut',
            code: 'U',
          },
          {
            name: 'Ciudad Autónoma de Buenos Aires',
            code: 'C',
          },
          {
            name: 'Córdoba',
            code: 'X',
          },
          {
            name: 'Corrientes',
            code: 'W',
          },
          {
            name: 'Entre Ríos',
            code: 'E',
          },
          {
            name: 'Formosa',
            code: 'P',
          },
          {
            name: 'Jujuy',
            code: 'Y',
          },
          {
            name: 'La Pampa',
            code: 'L',
          },
          {
            name: 'La Rioja',
            code: 'F',
          },
          {
            name: 'Mendoza',
            code: 'M',
          },
          {
            name: 'Misiones',
            code: 'N',
          },
          {
            name: 'Neuquén',
            code: 'Q',
          },
          {
            name: 'Río Negro',
            code: 'R',
          },
          {
            name: 'Salta',
            code: 'A',
          },
          {
            name: 'San Juan',
            code: 'J',
          },
          {
            name: 'San Luis',
            code: 'D',
          },
          {
            name: 'Santa Cruz',
            code: 'Z',
          },
          {
            name: 'Santa Fe',
            code: 'S',
          },
          {
            name: 'Santiago Del Estero',
            code: 'G',
          },
          {
            name: 'Tierra Del Fuego',
            code: 'V',
          },
          {
            name: 'Tucumán',
            code: 'T',
          },
        ],
        continent: 'South America',
      },
      {
        name: 'アルバ',
        code: 'AW',
        phoneNumberPrefix: 297,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'アルバニア',
        code: 'AL',
        phoneNumberPrefix: 355,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'アルメニア',
        code: 'AM',
        phoneNumberPrefix: 374,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'アンギラ',
        code: 'AI',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'アンゴラ',
        code: 'AO',
        phoneNumberPrefix: 244,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'アンティグア・バーブーダ',
        code: 'AG',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'アンドラ',
        code: 'AD',
        phoneNumberPrefix: 376,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'イエメン',
        code: 'YE',
        phoneNumberPrefix: 967,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'イギリス',
        code: 'GB',
        phoneNumberPrefix: 44,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTCODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'イスラエル',
        code: 'IL',
        phoneNumberPrefix: 972,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'イタリア',
        code: 'IT',
        phoneNumberPrefix: 39,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Agrigento',
            code: 'AG',
          },
          {
            name: 'Alessandria',
            code: 'AL',
          },
          {
            name: 'Ancona',
            code: 'AN',
          },
          {
            name: 'Aosta',
            code: 'AO',
          },
          {
            name: 'Arezzo',
            code: 'AR',
          },
          {
            name: 'Ascoli Piceno',
            code: 'AP',
          },
          {
            name: 'Asti',
            code: 'AT',
          },
          {
            name: 'Avellino',
            code: 'AV',
          },
          {
            name: 'Bari',
            code: 'BA',
          },
          {
            name: 'Barletta-Andria-Trani',
            code: 'BT',
          },
          {
            name: 'Belluno',
            code: 'BL',
          },
          {
            name: 'Benevento',
            code: 'BN',
          },
          {
            name: 'Bergamo',
            code: 'BG',
          },
          {
            name: 'Biella',
            code: 'BI',
          },
          {
            name: 'Bologna',
            code: 'BO',
          },
          {
            name: 'Bolzano',
            code: 'BZ',
          },
          {
            name: 'Brescia',
            code: 'BS',
          },
          {
            name: 'Brindisi',
            code: 'BR',
          },
          {
            name: 'Cagliari',
            code: 'CA',
          },
          {
            name: 'Caltanissetta',
            code: 'CL',
          },
          {
            name: 'Campobasso',
            code: 'CB',
          },
          {
            name: 'Carbonia-Iglesias',
            code: 'CI',
          },
          {
            name: 'Caserta',
            code: 'CE',
          },
          {
            name: 'Catania',
            code: 'CT',
          },
          {
            name: 'Catanzaro',
            code: 'CZ',
          },
          {
            name: 'Chieti',
            code: 'CH',
          },
          {
            name: 'Como',
            code: 'CO',
          },
          {
            name: 'Cosenza',
            code: 'CS',
          },
          {
            name: 'Cremona',
            code: 'CR',
          },
          {
            name: 'Crotone',
            code: 'KR',
          },
          {
            name: 'Cuneo',
            code: 'CN',
          },
          {
            name: 'Enna',
            code: 'EN',
          },
          {
            name: 'Fermo',
            code: 'FM',
          },
          {
            name: 'Ferrara',
            code: 'FE',
          },
          {
            name: 'Firenze',
            code: 'FI',
          },
          {
            name: 'Foggia',
            code: 'FG',
          },
          {
            name: 'Forlì-Cesena',
            code: 'FC',
          },
          {
            name: 'Frosinone',
            code: 'FR',
          },
          {
            name: 'Genova',
            code: 'GE',
          },
          {
            name: 'Gorizia',
            code: 'GO',
          },
          {
            name: 'Grosseto',
            code: 'GR',
          },
          {
            name: 'Imperia',
            code: 'IM',
          },
          {
            name: 'Isernia',
            code: 'IS',
          },
          {
            name: "L'Aquila",
            code: 'AQ',
          },
          {
            name: 'La Spezia',
            code: 'SP',
          },
          {
            name: 'Latina',
            code: 'LT',
          },
          {
            name: 'Lecce',
            code: 'LE',
          },
          {
            name: 'Lecco',
            code: 'LC',
          },
          {
            name: 'Livorno',
            code: 'LI',
          },
          {
            name: 'Lodi',
            code: 'LO',
          },
          {
            name: 'Lucca',
            code: 'LU',
          },
          {
            name: 'Macerata',
            code: 'MC',
          },
          {
            name: 'Mantova',
            code: 'MN',
          },
          {
            name: 'Massa-Carrara',
            code: 'MS',
          },
          {
            name: 'Matera',
            code: 'MT',
          },
          {
            name: 'Medio Campidano',
            code: 'VS',
          },
          {
            name: 'Messina',
            code: 'ME',
          },
          {
            name: 'Milano',
            code: 'MI',
          },
          {
            name: 'Modena',
            code: 'MO',
          },
          {
            name: 'Monza e Brianza',
            code: 'MB',
          },
          {
            name: 'Napoli',
            code: 'NA',
          },
          {
            name: 'Novara',
            code: 'NO',
          },
          {
            name: 'Nuoro',
            code: 'NU',
          },
          {
            name: 'Ogliastra',
            code: 'OG',
          },
          {
            name: 'Olbia-Tempio',
            code: 'OT',
          },
          {
            name: 'Oristano',
            code: 'OR',
          },
          {
            name: 'Padova',
            code: 'PD',
          },
          {
            name: 'Palermo',
            code: 'PA',
          },
          {
            name: 'Parma',
            code: 'PR',
          },
          {
            name: 'Pavia',
            code: 'PV',
          },
          {
            name: 'Perugia',
            code: 'PG',
          },
          {
            name: 'Pesaro e Urbino',
            code: 'PU',
          },
          {
            name: 'Pescara',
            code: 'PE',
          },
          {
            name: 'Piacenza',
            code: 'PC',
          },
          {
            name: 'Pisa',
            code: 'PI',
          },
          {
            name: 'Pistoia',
            code: 'PT',
          },
          {
            name: 'Pordenone',
            code: 'PN',
          },
          {
            name: 'Potenza',
            code: 'PZ',
          },
          {
            name: 'Prato',
            code: 'PO',
          },
          {
            name: 'Ragusa',
            code: 'RG',
          },
          {
            name: 'Ravenna',
            code: 'RA',
          },
          {
            name: 'Reggio Calabria',
            code: 'RC',
          },
          {
            name: 'Reggio Emilia',
            code: 'RE',
          },
          {
            name: 'Rieti',
            code: 'RI',
          },
          {
            name: 'Rimini',
            code: 'RN',
          },
          {
            name: 'Roma',
            code: 'RM',
          },
          {
            name: 'Rovigo',
            code: 'RO',
          },
          {
            name: 'Salerno',
            code: 'SA',
          },
          {
            name: 'Sassari',
            code: 'SS',
          },
          {
            name: 'Savona',
            code: 'SV',
          },
          {
            name: 'Siena',
            code: 'SI',
          },
          {
            name: 'Siracusa',
            code: 'SR',
          },
          {
            name: 'Sondrio',
            code: 'SO',
          },
          {
            name: 'Taranto',
            code: 'TA',
          },
          {
            name: 'Teramo',
            code: 'TE',
          },
          {
            name: 'Terni',
            code: 'TR',
          },
          {
            name: 'Torino',
            code: 'TO',
          },
          {
            name: 'Trapani',
            code: 'TP',
          },
          {
            name: 'Trento',
            code: 'TN',
          },
          {
            name: 'Treviso',
            code: 'TV',
          },
          {
            name: 'Trieste',
            code: 'TS',
          },
          {
            name: 'Udine',
            code: 'UD',
          },
          {
            name: 'Varese',
            code: 'VA',
          },
          {
            name: 'Venezia',
            code: 'VE',
          },
          {
            name: 'Verbano-Cusio-Ossola',
            code: 'VB',
          },
          {
            name: 'Vercelli',
            code: 'VC',
          },
          {
            name: 'Verona',
            code: 'VR',
          },
          {
            name: 'Vibo Valentia',
            code: 'VV',
          },
          {
            name: 'Vicenza',
            code: 'VI',
          },
          {
            name: 'Viterbo',
            code: 'VT',
          },
        ],
        continent: 'Europe',
      },
      {
        name: 'イラク',
        code: 'IQ',
        phoneNumberPrefix: 964,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'イラン',
        code: 'IR',
        phoneNumberPrefix: 98,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'インド',
        code: 'IN',
        phoneNumberPrefix: 91,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'PINCODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Andaman and Nicobar',
            code: 'AN',
          },
          {
            name: 'Andhra Pradesh',
            code: 'AP',
          },
          {
            name: 'Arunachal Pradesh',
            code: 'AR',
          },
          {
            name: 'Assam',
            code: 'AS',
          },
          {
            name: 'Bihar',
            code: 'BR',
          },
          {
            name: 'Chandigarh',
            code: 'CH',
          },
          {
            name: 'Chattisgarh',
            code: 'CG',
          },
          {
            name: 'Dadra and Nagar Haveli',
            code: 'DN',
          },
          {
            name: 'Daman and Diu',
            code: 'DD',
          },
          {
            name: 'Delhi',
            code: 'DL',
          },
          {
            name: 'Goa',
            code: 'GA',
          },
          {
            name: 'Gujarat',
            code: 'GJ',
          },
          {
            name: 'Haryana',
            code: 'HR',
          },
          {
            name: 'Himachal Pradesh',
            code: 'HP',
          },
          {
            name: 'Jammu and Kashmir',
            code: 'JK',
          },
          {
            name: 'Jharkhand',
            code: 'JH',
          },
          {
            name: 'Karnataka',
            code: 'KA',
          },
          {
            name: 'Kerala',
            code: 'KL',
          },
          {
            name: 'Lakshadweep',
            code: 'LD',
          },
          {
            name: 'Madhya Pradesh',
            code: 'MP',
          },
          {
            name: 'Maharashtra',
            code: 'MH',
          },
          {
            name: 'Manipur',
            code: 'MN',
          },
          {
            name: 'Meghalaya',
            code: 'ML',
          },
          {
            name: 'Mizoram',
            code: 'MZ',
          },
          {
            name: 'Nagaland',
            code: 'NL',
          },
          {
            name: 'Orissa',
            code: 'OR',
          },
          {
            name: 'Puducherry',
            code: 'PY',
          },
          {
            name: 'Punjab',
            code: 'PB',
          },
          {
            name: 'Rajasthan',
            code: 'RJ',
          },
          {
            name: 'Sikkim',
            code: 'SK',
          },
          {
            name: 'Tamil Nadu',
            code: 'TN',
          },
          {
            name: 'Telangana',
            code: 'TS',
          },
          {
            name: 'Tripura',
            code: 'TR',
          },
          {
            name: 'Uttar Pradesh',
            code: 'UP',
          },
          {
            name: 'Uttarakhand',
            code: 'UK',
          },
          {
            name: 'West Bengal',
            code: 'WB',
          },
        ],
        continent: 'Asia',
      },
      {
        name: 'インドネシア',
        code: 'ID',
        phoneNumberPrefix: 62,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{province}_{city} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Aceh',
            code: 'AC',
          },
          {
            name: 'Bali',
            code: 'BA',
          },
          {
            name: 'Bangka Belitung',
            code: 'BB',
          },
          {
            name: 'Banten',
            code: 'BT',
          },
          {
            name: 'Bengkulu',
            code: 'BE',
          },
          {
            name: 'Gorontalo',
            code: 'GO',
          },
          {
            name: 'Jakarta',
            code: 'JK',
          },
          {
            name: 'Jambi',
            code: 'JA',
          },
          {
            name: 'Jawa Barat',
            code: 'JB',
          },
          {
            name: 'Jawa Tengah',
            code: 'JT',
          },
          {
            name: 'Jawa Timur',
            code: 'JI',
          },
          {
            name: 'Kalimantan Barat',
            code: 'KB',
          },
          {
            name: 'Kalimantan Selatan',
            code: 'KS',
          },
          {
            name: 'Kalimantan Tengah',
            code: 'KT',
          },
          {
            name: 'Kalimantan Timur',
            code: 'KI',
          },
          {
            name: 'Kalimantan Utara',
            code: 'KU',
          },
          {
            name: 'Kepulauan Riau',
            code: 'KR',
          },
          {
            name: 'Lampung',
            code: 'LA',
          },
          {
            name: 'Maluku',
            code: 'MA',
          },
          {
            name: 'Maluku Utara',
            code: 'MU',
          },
          {
            name: 'Nusa Tenggara Barat',
            code: 'NB',
          },
          {
            name: 'Nusa Tenggara Timur',
            code: 'NT',
          },
          {
            name: 'Papua',
            code: 'PA',
          },
          {
            name: 'Papua Barat',
            code: 'PB',
          },
          {
            name: 'Riau',
            code: 'RI',
          },
          {
            name: 'Sulawesi Barat',
            code: 'SR',
          },
          {
            name: 'Sulawesi Selatan',
            code: 'SN',
          },
          {
            name: 'Sulawesi Tengah',
            code: 'ST',
          },
          {
            name: 'Sulawesi Tenggara',
            code: 'SG',
          },
          {
            name: 'Sulawesi Utara',
            code: 'SA',
          },
          {
            name: 'Sumatra Barat',
            code: 'SB',
          },
          {
            name: 'Sumatra Selatan',
            code: 'SS',
          },
          {
            name: 'Sumatra Utara',
            code: 'SU',
          },
          {
            name: 'Yogyakarta',
            code: 'YO',
          },
        ],
        continent: 'Asia',
      },
      {
        name: 'ウォリス・フツナ',
        code: 'WF',
        phoneNumberPrefix: 681,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'ウガンダ',
        code: 'UG',
        phoneNumberPrefix: 256,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ウクライナ',
        code: 'UA',
        phoneNumberPrefix: 380,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ウズベキスタン',
        code: 'UZ',
        phoneNumberPrefix: 998,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ウルグアイ',
        code: 'UY',
        phoneNumberPrefix: 598,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'エクアドル',
        code: 'EC',
        phoneNumberPrefix: 593,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'エジプト',
        code: 'EG',
        phoneNumberPrefix: 20,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'GOVERNORATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{province}_{city}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: '6th of October',
            code: 'SU',
          },
          {
            name: 'Al Sharqia',
            code: 'SHR',
          },
          {
            name: 'Alexandria',
            code: 'ALX',
          },
          {
            name: 'Aswan',
            code: 'ASN',
          },
          {
            name: 'Asyut',
            code: 'AST',
          },
          {
            name: 'Beheira',
            code: 'BH',
          },
          {
            name: 'Beni Suef',
            code: 'BNS',
          },
          {
            name: 'Cairo',
            code: 'C',
          },
          {
            name: 'Dakahlia',
            code: 'DK',
          },
          {
            name: 'Damietta',
            code: 'DT',
          },
          {
            name: 'Faiyum',
            code: 'FYM',
          },
          {
            name: 'Gharbia',
            code: 'GH',
          },
          {
            name: 'Giza',
            code: 'GZ',
          },
          {
            name: 'Helwan',
            code: 'HU',
          },
          {
            name: 'Ismailia',
            code: 'IS',
          },
          {
            name: 'Kafr el-Sheikh',
            code: 'KFS',
          },
          {
            name: 'Luxor',
            code: 'LX',
          },
          {
            name: 'Matrouh',
            code: 'MT',
          },
          {
            name: 'Minya',
            code: 'MN',
          },
          {
            name: 'Monufia',
            code: 'MNF',
          },
          {
            name: 'New Valley',
            code: 'WAD',
          },
          {
            name: 'North Sinai',
            code: 'SIN',
          },
          {
            name: 'Port Said',
            code: 'PTS',
          },
          {
            name: 'Qalyubia',
            code: 'KB',
          },
          {
            name: 'Qena',
            code: 'KN',
          },
          {
            name: 'Red Sea',
            code: 'BA',
          },
          {
            name: 'Sohag',
            code: 'SHG',
          },
          {
            name: 'South Sinai',
            code: 'JS',
          },
          {
            name: 'Suez',
            code: 'SUZ',
          },
        ],
        continent: 'Africa',
      },
      {
        name: 'エストニア',
        code: 'EE',
        phoneNumberPrefix: 372,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'エチオピア',
        code: 'ET',
        phoneNumberPrefix: 251,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'エリトリア',
        code: 'ER',
        phoneNumberPrefix: 291,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'エルサルバドル',
        code: 'SV',
        phoneNumberPrefix: 503,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'オマーン',
        code: 'OM',
        phoneNumberPrefix: 968,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'オランダ',
        code: 'NL',
        phoneNumberPrefix: 31,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'オランダ領アンティル',
        code: 'AN',
        phoneNumberPrefix: 599,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'オランダ領カリブ',
        code: 'BQ',
        phoneNumberPrefix: 599,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'オーストラリア',
        code: 'AU',
        phoneNumberPrefix: 61,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE_AND_TERRITORY',
        zipKey: 'POSTCODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Australian Capital Territory',
            code: 'ACT',
          },
          {
            name: 'New South Wales',
            code: 'NSW',
          },
          {
            name: 'Northern Territory',
            code: 'NT',
          },
          {
            name: 'Queensland',
            code: 'QLD',
          },
          {
            name: 'South Australia',
            code: 'SA',
          },
          {
            name: 'Tasmania',
            code: 'TAS',
          },
          {
            name: 'Victoria',
            code: 'VIC',
          },
          {
            name: 'Western Australia',
            code: 'WA',
          },
        ],
        continent: 'Oceania',
      },
      {
        name: 'オーストリア',
        code: 'AT',
        phoneNumberPrefix: 43,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'オーランド諸島',
        code: 'AX',
        phoneNumberPrefix: 358,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'カザフスタン',
        code: 'KZ',
        phoneNumberPrefix: 7,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'カタール',
        code: 'QA',
        phoneNumberPrefix: 974,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
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
        continent: 'North America',
      },
      {
        name: 'カメルーン',
        code: 'CM',
        phoneNumberPrefix: 237,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'カンボジア',
        code: 'KH',
        phoneNumberPrefix: 855,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'カーボベルデ',
        code: 'CV',
        phoneNumberPrefix: 238,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ガイアナ',
        code: 'GY',
        phoneNumberPrefix: 592,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'ガボン',
        code: 'GA',
        phoneNumberPrefix: 241,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ガンビア',
        code: 'GM',
        phoneNumberPrefix: 220,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ガーナ',
        code: 'GH',
        phoneNumberPrefix: 233,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ガーンジー',
        code: 'GG',
        phoneNumberPrefix: 44,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'キプロス',
        code: 'CY',
        phoneNumberPrefix: 357,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'キュラソー',
        code: 'CW',
        phoneNumberPrefix: 599,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'キューバ',
        code: 'CU',
        phoneNumberPrefix: 53,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'キリバス',
        code: 'KI',
        phoneNumberPrefix: 686,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'キルギス',
        code: 'KG',
        phoneNumberPrefix: 996,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{zip} {city}_{address2}_{address1}_{company}_{firstName} {lastName}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ギニア',
        code: 'GN',
        phoneNumberPrefix: 224,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ギニアビサウ',
        code: 'GW',
        phoneNumberPrefix: 245,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ギリシャ',
        code: 'GR',
        phoneNumberPrefix: 30,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'クウェート',
        code: 'KW',
        phoneNumberPrefix: 965,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'クック諸島',
        code: 'CK',
        phoneNumberPrefix: 682,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'クリスマス島',
        code: 'CX',
        phoneNumberPrefix: 61,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'クロアチア',
        code: 'HR',
        phoneNumberPrefix: 385,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'グアテマラ',
        code: 'GT',
        phoneNumberPrefix: 502,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Alta Verapaz',
            code: 'AVE',
          },
          {
            name: 'Baja Verapaz',
            code: 'BVE',
          },
          {
            name: 'Chimaltenango',
            code: 'CMT',
          },
          {
            name: 'Chiquimula',
            code: 'CQM',
          },
          {
            name: 'El Progreso',
            code: 'EPR',
          },
          {
            name: 'Escuintla',
            code: 'ESC',
          },
          {
            name: 'Guatemala',
            code: 'GUA',
          },
          {
            name: 'Huehuetenango',
            code: 'HUE',
          },
          {
            name: 'Izabal',
            code: 'IZA',
          },
          {
            name: 'Jalapa',
            code: 'JAL',
          },
          {
            name: 'Jutiapa',
            code: 'JUT',
          },
          {
            name: 'Petén',
            code: 'PET',
          },
          {
            name: 'Quetzaltenango',
            code: 'QUE',
          },
          {
            name: 'Quiché',
            code: 'QUI',
          },
          {
            name: 'Retalhuleu',
            code: 'RET',
          },
          {
            name: 'Sacatepéquez',
            code: 'SAC',
          },
          {
            name: 'San Marcos',
            code: 'SMA',
          },
          {
            name: 'Santa Rosa',
            code: 'SRO',
          },
          {
            name: 'Sololá',
            code: 'SOL',
          },
          {
            name: 'Suchitepéquez',
            code: 'SUC',
          },
          {
            name: 'Totonicapán',
            code: 'TOT',
          },
          {
            name: 'Zacapa',
            code: 'ZAC',
          },
        ],
        continent: 'Central America',
      },
      {
        name: 'グアドループ',
        code: 'GP',
        phoneNumberPrefix: 590,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'グリーンランド',
        code: 'GL',
        phoneNumberPrefix: 299,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'グルジア',
        code: 'GE',
        phoneNumberPrefix: 995,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'グレナダ',
        code: 'GD',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ケイマン諸島',
        code: 'KY',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ケニア',
        code: 'KE',
        phoneNumberPrefix: 254,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ココス(キーリング)諸島',
        code: 'CC',
        phoneNumberPrefix: 891,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'コスタリカ',
        code: 'CR',
        phoneNumberPrefix: 506,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'コソボ',
        code: 'XK',
        phoneNumberPrefix: 383,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'コモロ',
        code: 'KM',
        phoneNumberPrefix: 269,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'コロンビア',
        code: 'CO',
        phoneNumberPrefix: 57,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Bogotá, D.C.',
            code: 'DC',
          },
          {
            name: 'Amazonas',
            code: 'AMA',
          },
          {
            name: 'Antioquia',
            code: 'ANT',
          },
          {
            name: 'Arauca',
            code: 'ARA',
          },
          {
            name: 'Atlántico',
            code: 'ATL',
          },
          {
            name: 'Bolívar',
            code: 'BOL',
          },
          {
            name: 'Boyacá',
            code: 'BOY',
          },
          {
            name: 'Caldas',
            code: 'CAL',
          },
          {
            name: 'Caquetá',
            code: 'CAQ',
          },
          {
            name: 'Casanare',
            code: 'CAS',
          },
          {
            name: 'Cauca',
            code: 'CAU',
          },
          {
            name: 'Cesar',
            code: 'CES',
          },
          {
            name: 'Chocó',
            code: 'CHO',
          },
          {
            name: 'Córdoba',
            code: 'COR',
          },
          {
            name: 'Cundinamarca',
            code: 'CUN',
          },
          {
            name: 'Guainía',
            code: 'GUA',
          },
          {
            name: 'Guaviare',
            code: 'GUV',
          },
          {
            name: 'Huila',
            code: 'HUI',
          },
          {
            name: 'La Guajira',
            code: 'LAG',
          },
          {
            name: 'Magdalena',
            code: 'MAG',
          },
          {
            name: 'Meta',
            code: 'MET',
          },
          {
            name: 'Nariño',
            code: 'NAR',
          },
          {
            name: 'Norte de Santander',
            code: 'NSA',
          },
          {
            name: 'Putumayo',
            code: 'PUT',
          },
          {
            name: 'Quindío',
            code: 'QUI',
          },
          {
            name: 'Risaralda',
            code: 'RIS',
          },
          {
            name: 'San Andrés, Providencia y Santa Catalina',
            code: 'SAP',
          },
          {
            name: 'Santander',
            code: 'SAN',
          },
          {
            name: 'Sucre',
            code: 'SUC',
          },
          {
            name: 'Tolima',
            code: 'TOL',
          },
          {
            name: 'Valle del Cauca',
            code: 'VAC',
          },
          {
            name: 'Vaupés',
            code: 'VAU',
          },
          {
            name: 'Vichada',
            code: 'VID',
          },
        ],
        continent: 'South America',
      },
      {
        name: 'コンゴ共和国(ブラザビル)',
        code: 'CG',
        phoneNumberPrefix: 243,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'コンゴ民主共和国(キンシャサ)',
        code: 'CD',
        phoneNumberPrefix: 243,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'コートジボワール',
        code: 'CI',
        phoneNumberPrefix: 225,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'サウジアラビア',
        code: 'SA',
        phoneNumberPrefix: 966,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'サモア',
        code: 'WS',
        phoneNumberPrefix: 685,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'サントメ・プリンシペ',
        code: 'ST',
        phoneNumberPrefix: 239,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'サンピエール島・ミクロン島',
        code: 'PM',
        phoneNumberPrefix: 508,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'サンマリノ',
        code: 'SM',
        phoneNumberPrefix: 378,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'サン・バルテルミー島',
        code: 'BL',
        phoneNumberPrefix: 590,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'サン・マルタン',
        code: 'MF',
        phoneNumberPrefix: 590,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ザンビア',
        code: 'ZM',
        phoneNumberPrefix: 260,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'シエラレオネ',
        code: 'SL',
        phoneNumberPrefix: 232,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'シリア',
        code: 'SY',
        phoneNumberPrefix: 963,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'シンガポール',
        code: 'SG',
        phoneNumberPrefix: 65,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'シント・マールテン',
        code: 'SX',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ジブチ',
        code: 'DJ',
        phoneNumberPrefix: 253,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ジブラルタル',
        code: 'GI',
        phoneNumberPrefix: 350,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ジャマイカ',
        code: 'JM',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ジャージー',
        code: 'JE',
        phoneNumberPrefix: 44,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ジンバブエ',
        code: 'ZW',
        phoneNumberPrefix: 263,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'スイス',
        code: 'CH',
        phoneNumberPrefix: 41,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'スウェーデン',
        code: 'SE',
        phoneNumberPrefix: 46,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'スバールバル諸島・ヤンマイエン島',
        code: 'SJ',
        phoneNumberPrefix: 47,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'スペイン',
        code: 'ES',
        phoneNumberPrefix: 34,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'A Coruña',
            code: 'C',
          },
          {
            name: 'Álava',
            code: 'VI',
          },
          {
            name: 'Albacete',
            code: 'AB',
          },
          {
            name: 'Alicante',
            code: 'A',
          },
          {
            name: 'Almería',
            code: 'AL',
          },
          {
            name: 'Asturias',
            code: 'O',
          },
          {
            name: 'Ávila',
            code: 'AV',
          },
          {
            name: 'Badajoz',
            code: 'BA',
          },
          {
            name: 'Balears',
            code: 'PM',
          },
          {
            name: 'Barcelona',
            code: 'B',
          },
          {
            name: 'Burgos',
            code: 'BU',
          },
          {
            name: 'Cáceres',
            code: 'CC',
          },
          {
            name: 'Cádiz',
            code: 'CA',
          },
          {
            name: 'Cantabria',
            code: 'S',
          },
          {
            name: 'Castellón',
            code: 'CS',
          },
          {
            name: 'Ceuta',
            code: 'CE',
          },
          {
            name: 'Ciudad Real',
            code: 'CR',
          },
          {
            name: 'Córdoba',
            code: 'CO',
          },
          {
            name: 'Cuenca',
            code: 'CU',
          },
          {
            name: 'Girona',
            code: 'GI',
          },
          {
            name: 'Granada',
            code: 'GR',
          },
          {
            name: 'Guadalajara',
            code: 'GU',
          },
          {
            name: 'Guipúzcoa',
            code: 'SS',
          },
          {
            name: 'Huelva',
            code: 'H',
          },
          {
            name: 'Huesca',
            code: 'HU',
          },
          {
            name: 'Jaén',
            code: 'J',
          },
          {
            name: 'La Rioja',
            code: 'LO',
          },
          {
            name: 'Las Palmas',
            code: 'GC',
          },
          {
            name: 'León',
            code: 'LE',
          },
          {
            name: 'Lleida',
            code: 'L',
          },
          {
            name: 'Lugo',
            code: 'LU',
          },
          {
            name: 'Madrid',
            code: 'M',
          },
          {
            name: 'Málaga',
            code: 'MA',
          },
          {
            name: 'Melilla',
            code: 'ML',
          },
          {
            name: 'Murcia',
            code: 'MU',
          },
          {
            name: 'Navarra',
            code: 'NA',
          },
          {
            name: 'Ourense',
            code: 'OR',
          },
          {
            name: 'Palencia',
            code: 'P',
          },
          {
            name: 'Pontevedra',
            code: 'PO',
          },
          {
            name: 'Salamanca',
            code: 'SA',
          },
          {
            name: 'Santa Cruz de Tenerife',
            code: 'TF',
          },
          {
            name: 'Segovia',
            code: 'SG',
          },
          {
            name: 'Sevilla',
            code: 'SE',
          },
          {
            name: 'Soria',
            code: 'SO',
          },
          {
            name: 'Tarragona',
            code: 'T',
          },
          {
            name: 'Teruel',
            code: 'TE',
          },
          {
            name: 'Toledo',
            code: 'TO',
          },
          {
            name: 'Valencia',
            code: 'V',
          },
          {
            name: 'Valladolid',
            code: 'VA',
          },
          {
            name: 'Vizcaya',
            code: 'BI',
          },
          {
            name: 'Zamora',
            code: 'ZA',
          },
          {
            name: 'Zaragoza',
            code: 'Z',
          },
        ],
        continent: 'Europe',
      },
      {
        name: 'スリナム',
        code: 'SR',
        phoneNumberPrefix: 597,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'スリランカ',
        code: 'LK',
        phoneNumberPrefix: 94,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'スロバキア',
        code: 'SK',
        phoneNumberPrefix: 421,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'スロベニア',
        code: 'SI',
        phoneNumberPrefix: 386,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'スワジランド',
        code: 'SZ',
        phoneNumberPrefix: 268,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'スーダン',
        code: 'SD',
        phoneNumberPrefix: 249,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'セネガル',
        code: 'SN',
        phoneNumberPrefix: 221,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'セルビア',
        code: 'RS',
        phoneNumberPrefix: 381,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'セントクリストファー・ネイビス',
        code: 'KN',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'セントビンセント・グレナディーン諸島',
        code: 'VC',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'セントヘレナ',
        code: 'SH',
        phoneNumberPrefix: 290,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'セントルシア',
        code: 'LC',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'セーシェル',
        code: 'SC',
        phoneNumberPrefix: 248,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ソマリア',
        code: 'SO',
        phoneNumberPrefix: 252,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ソロモン諸島',
        code: 'SB',
        phoneNumberPrefix: 677,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'タイ',
        code: 'TH',
        phoneNumberPrefix: 66,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Amnat Charoen',
            code: 'TH-37',
          },
          {
            name: 'Ang Thong',
            code: 'TH-15',
          },
          {
            name: 'Bangkok',
            code: 'TH-10',
          },
          {
            name: 'Bueng Kan',
            code: 'TH-38',
          },
          {
            name: 'Buriram',
            code: 'TH-31',
          },
          {
            name: 'Chachoengsao',
            code: 'TH-24',
          },
          {
            name: 'Chai Nat',
            code: 'TH-18',
          },
          {
            name: 'Chaiyaphum',
            code: 'TH-36',
          },
          {
            name: 'Chanthaburi',
            code: 'TH-22',
          },
          {
            name: 'Chiang Mai',
            code: 'TH-50',
          },
          {
            name: 'Chiang Rai',
            code: 'TH-57',
          },
          {
            name: 'Chon Buri',
            code: 'TH-20',
          },
          {
            name: 'Chumphon',
            code: 'TH-86',
          },
          {
            name: 'Kalasin',
            code: 'TH-46',
          },
          {
            name: 'Kamphaeng Phet',
            code: 'TH-62',
          },
          {
            name: 'Kanchanaburi',
            code: 'TH-71',
          },
          {
            name: 'Khon Kaen',
            code: 'TH-40',
          },
          {
            name: 'Krabi',
            code: 'TH-81',
          },
          {
            name: 'Lampang',
            code: 'TH-52',
          },
          {
            name: 'Lamphun',
            code: 'TH-51',
          },
          {
            name: 'Loei',
            code: 'TH-42',
          },
          {
            name: 'Lopburi',
            code: 'TH-16',
          },
          {
            name: 'Mae Hong Son',
            code: 'TH-58',
          },
          {
            name: 'Maha Sarakham',
            code: 'TH-44',
          },
          {
            name: 'Mukdahan',
            code: 'TH-49',
          },
          {
            name: 'Nakhon Nayok',
            code: 'TH-26',
          },
          {
            name: 'Nakhon Pathom',
            code: 'TH-73',
          },
          {
            name: 'Nakhon Phanom',
            code: 'TH-48',
          },
          {
            name: 'Nakhon Ratchasima',
            code: 'TH-30',
          },
          {
            name: 'Nakhon Sawan',
            code: 'TH-60',
          },
          {
            name: 'Nakhon Si Thammarat',
            code: 'TH-80',
          },
          {
            name: 'Nan',
            code: 'TH-55',
          },
          {
            name: 'Narathiwat',
            code: 'TH-96',
          },
          {
            name: 'Nong Bua Lam Phu',
            code: 'TH-39',
          },
          {
            name: 'Nong Khai',
            code: 'TH-43',
          },
          {
            name: 'Nonthaburi',
            code: 'TH-12',
          },
          {
            name: 'Pathum Thani',
            code: 'TH-13',
          },
          {
            name: 'Pattani',
            code: 'TH-94',
          },
          {
            name: 'Pattaya',
            code: 'TH-S',
          },
          {
            name: 'Phangnga',
            code: 'TH-82',
          },
          {
            name: 'Phatthalung',
            code: 'TH-93',
          },
          {
            name: 'Phayao',
            code: 'TH-56',
          },
          {
            name: 'Phetchabun',
            code: 'TH-67',
          },
          {
            name: 'Phetchaburi',
            code: 'TH-76',
          },
          {
            name: 'Phichit',
            code: 'TH-66',
          },
          {
            name: 'Phitsanulok',
            code: 'TH-65',
          },
          {
            name: 'Phra Nakhon Si Ayutthaya',
            code: 'TH-14',
          },
          {
            name: 'Phrae',
            code: 'TH-54',
          },
          {
            name: 'Phuket',
            code: 'TH-83',
          },
          {
            name: 'Prachin Buri',
            code: 'TH-25',
          },
          {
            name: 'Prachuap Khiri Khan',
            code: 'TH-77',
          },
          {
            name: 'Ranong',
            code: 'TH-85',
          },
          {
            name: 'Ratchaburi',
            code: 'TH-70',
          },
          {
            name: 'Rayong',
            code: 'TH-21',
          },
          {
            name: 'Roi Et',
            code: 'TH-45',
          },
          {
            name: 'Sa Kaeo',
            code: 'TH-27',
          },
          {
            name: 'Sakon Nakhon',
            code: 'TH-47',
          },
          {
            name: 'Samut Prakan',
            code: 'TH-11',
          },
          {
            name: 'Samut Sakhon',
            code: 'TH-74',
          },
          {
            name: 'Samut Songkhram',
            code: 'TH-75',
          },
          {
            name: 'Saraburi',
            code: 'TH-19',
          },
          {
            name: 'Satun',
            code: 'TH-91',
          },
          {
            name: 'Sing Buri',
            code: 'TH-17',
          },
          {
            name: 'Sisaket',
            code: 'TH-33',
          },
          {
            name: 'Songkhla',
            code: 'TH-90',
          },
          {
            name: 'Sukhothai',
            code: 'TH-64',
          },
          {
            name: 'Suphan Buri',
            code: 'TH-72',
          },
          {
            name: 'Surat Thani',
            code: 'TH-84',
          },
          {
            name: 'Surin',
            code: 'TH-32',
          },
          {
            name: 'Tak',
            code: 'TH-63',
          },
          {
            name: 'Trang',
            code: 'TH-92',
          },
          {
            name: 'Trat',
            code: 'TH-23',
          },
          {
            name: 'Ubon Ratchathani',
            code: 'TH-34',
          },
          {
            name: 'Udon Thani',
            code: 'TH-41',
          },
          {
            name: 'Uthai Thani',
            code: 'TH-61',
          },
          {
            name: 'Uttaradit',
            code: 'TH-53',
          },
          {
            name: 'Yala',
            code: 'TH-95',
          },
          {
            name: 'Yasothon',
            code: 'TH-35',
          },
        ],
        continent: 'Asia',
      },
      {
        name: 'タジキスタン',
        code: 'TJ',
        phoneNumberPrefix: 992,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'タンザニア',
        code: 'TZ',
        phoneNumberPrefix: 255,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'タークス・カイコス諸島',
        code: 'TC',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'チェコ共和国',
        code: 'CZ',
        phoneNumberPrefix: 420,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'チャド',
        code: 'TD',
        phoneNumberPrefix: 235,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'チュニジア',
        code: 'TN',
        phoneNumberPrefix: 216,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'チリ',
        code: 'CL',
        phoneNumberPrefix: 56,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'ツバル',
        code: 'TV',
        phoneNumberPrefix: 688,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'デンマーク',
        code: 'DK',
        phoneNumberPrefix: 45,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'トケラウ',
        code: 'TK',
        phoneNumberPrefix: 690,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'トリニダード・トバゴ',
        code: 'TT',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'トルクメニスタン',
        code: 'TM',
        phoneNumberPrefix: 993,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'トルコ',
        code: 'TR',
        phoneNumberPrefix: 90,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'トンガ',
        code: 'TO',
        phoneNumberPrefix: 676,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'トーゴ',
        code: 'TG',
        phoneNumberPrefix: 228,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ドイツ',
        code: 'DE',
        phoneNumberPrefix: 49,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ドミニカ共和国',
        code: 'DO',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ドミニカ国',
        code: 'DM',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ナイジェリア',
        code: 'NG',
        phoneNumberPrefix: 234,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Abia',
            code: 'AB',
          },
          {
            name: 'Abuja Federal Capital Territory',
            code: 'FC',
          },
          {
            name: 'Adamawa',
            code: 'AD',
          },
          {
            name: 'Akwa Ibom',
            code: 'AK',
          },
          {
            name: 'Anambra',
            code: 'AN',
          },
          {
            name: 'Bauchi',
            code: 'BA',
          },
          {
            name: 'Bayelsa',
            code: 'BY',
          },
          {
            name: 'Benue',
            code: 'BE',
          },
          {
            name: 'Borno',
            code: 'BO',
          },
          {
            name: 'Cross River',
            code: 'CR',
          },
          {
            name: 'Delta',
            code: 'DE',
          },
          {
            name: 'Ebonyi',
            code: 'EB',
          },
          {
            name: 'Edo',
            code: 'ED',
          },
          {
            name: 'Ekiti',
            code: 'EK',
          },
          {
            name: 'Enugu',
            code: 'EN',
          },
          {
            name: 'Gombe',
            code: 'GO',
          },
          {
            name: 'Imo',
            code: 'IM',
          },
          {
            name: 'Jigawa',
            code: 'JI',
          },
          {
            name: 'Kaduna',
            code: 'KD',
          },
          {
            name: 'Kano',
            code: 'KN',
          },
          {
            name: 'Katsina',
            code: 'KT',
          },
          {
            name: 'Kebbi',
            code: 'KE',
          },
          {
            name: 'Kogi',
            code: 'KO',
          },
          {
            name: 'Kwara',
            code: 'KW',
          },
          {
            name: 'Lagos',
            code: 'LA',
          },
          {
            name: 'Nasarawa',
            code: 'NA',
          },
          {
            name: 'Niger',
            code: 'NI',
          },
          {
            name: 'Ogun',
            code: 'OG',
          },
          {
            name: 'Ondo',
            code: 'ON',
          },
          {
            name: 'Osun',
            code: 'OS',
          },
          {
            name: 'Oyo',
            code: 'OY',
          },
          {
            name: 'Plateau',
            code: 'PL',
          },
          {
            name: 'Rivers',
            code: 'RI',
          },
          {
            name: 'Sokoto',
            code: 'SO',
          },
          {
            name: 'Taraba',
            code: 'TA',
          },
          {
            name: 'Yobe',
            code: 'YO',
          },
          {
            name: 'Zamfara',
            code: 'ZA',
          },
        ],
        continent: 'Africa',
      },
      {
        name: 'ナウル',
        code: 'NR',
        phoneNumberPrefix: 674,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'ナミビア',
        code: 'NA',
        phoneNumberPrefix: 264,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ニウエ島',
        code: 'NU',
        phoneNumberPrefix: 683,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'ニカラグア',
        code: 'NI',
        phoneNumberPrefix: 505,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ニジェール',
        code: 'NE',
        phoneNumberPrefix: 227,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ニューカレドニア',
        code: 'NC',
        phoneNumberPrefix: 687,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'ニュージーランド',
        code: 'NZ',
        phoneNumberPrefix: 64,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{province}_{city} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Auckland',
            code: 'AUK',
          },
          {
            name: 'Bay of Plenty',
            code: 'BOP',
          },
          {
            name: 'Canterbury',
            code: 'CAN',
          },
          {
            name: 'Gisborne',
            code: 'GIS',
          },
          {
            name: "Hawke's Bay",
            code: 'HKB',
          },
          {
            name: 'Manawatu-Wanganui',
            code: 'MWT',
          },
          {
            name: 'Marlborough',
            code: 'MBH',
          },
          {
            name: 'Nelson',
            code: 'NSN',
          },
          {
            name: 'Northland',
            code: 'NTL',
          },
          {
            name: 'Otago',
            code: 'OTA',
          },
          {
            name: 'Southland',
            code: 'STL',
          },
          {
            name: 'Taranaki',
            code: 'TKI',
          },
          {
            name: 'Tasman',
            code: 'TAS',
          },
          {
            name: 'Waikato',
            code: 'WKO',
          },
          {
            name: 'Wellington',
            code: 'WGN',
          },
          {
            name: 'West Coast',
            code: 'WTC',
          },
        ],
        continent: 'Oceania',
      },
      {
        name: 'ネパール',
        code: 'NP',
        phoneNumberPrefix: 977,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ノルウェー',
        code: 'NO',
        phoneNumberPrefix: 47,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ノーフォーク島',
        code: 'NF',
        phoneNumberPrefix: 672,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'ハイチ',
        code: 'HT',
        phoneNumberPrefix: 509,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ハンガリー',
        code: 'HU',
        phoneNumberPrefix: 36,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ハード島・マクドナルド諸島',
        code: 'HM',
        phoneNumberPrefix: 0,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Other',
      },
      {
        name: 'バチカン市国',
        code: 'VA',
        phoneNumberPrefix: 379,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'バヌアツ',
        code: 'VU',
        phoneNumberPrefix: 678,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'バハマ',
        code: 'BS',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'バミューダ',
        code: 'BM',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'バルバドス',
        code: 'BB',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'バングラデシュ',
        code: 'BD',
        phoneNumberPrefix: 880,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'バーレーン',
        code: 'BH',
        phoneNumberPrefix: 973,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'パキスタン',
        code: 'PK',
        phoneNumberPrefix: 92,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'パナマ',
        code: 'PA',
        phoneNumberPrefix: 507,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Bocas del Toro',
            code: 'PA-1',
          },
          {
            name: 'Chiriquí',
            code: 'PA-4',
          },
          {
            name: 'Coclé',
            code: 'PA-2',
          },
          {
            name: 'Colón',
            code: 'PA-3',
          },
          {
            name: 'Darién',
            code: 'PA-5',
          },
          {
            name: 'Emberá',
            code: 'PA-EM',
          },
          {
            name: 'Herrera',
            code: 'PA-6',
          },
          {
            name: 'Kuna Yala',
            code: 'PA-KY',
          },
          {
            name: 'Los Santos',
            code: 'PA-7',
          },
          {
            name: 'Ngöbe-Buglé',
            code: 'PA-NB',
          },
          {
            name: 'Panamá',
            code: 'PA-8',
          },
          {
            name: 'Panamá Oeste',
            code: 'PA-10',
          },
          {
            name: 'Veraguas',
            code: 'PA-9',
          },
        ],
        continent: 'Central America',
      },
      {
        name: 'パプアニューギニア',
        code: 'PG',
        phoneNumberPrefix: 675,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'パラグアイ',
        code: 'PY',
        phoneNumberPrefix: 595,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'パレスチナ',
        code: 'PS',
        phoneNumberPrefix: 970,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ピトケアン諸島',
        code: 'PN',
        phoneNumberPrefix: 64,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'フィジー',
        code: 'FJ',
        phoneNumberPrefix: 679,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: 'フィリピン',
        code: 'PH',
        phoneNumberPrefix: 63,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'フィンランド',
        code: 'FI',
        phoneNumberPrefix: 358,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'フェロー諸島',
        code: 'FO',
        phoneNumberPrefix: 298,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'フォークランド諸島',
        code: 'FK',
        phoneNumberPrefix: 500,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'フランス',
        code: 'FR',
        phoneNumberPrefix: 33,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ブラジル',
        code: 'BR',
        phoneNumberPrefix: 55,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Acre',
            code: 'AC',
          },
          {
            name: 'Alagoas',
            code: 'AL',
          },
          {
            name: 'Amapá',
            code: 'AP',
          },
          {
            name: 'Amazonas',
            code: 'AM',
          },
          {
            name: 'Bahia',
            code: 'BA',
          },
          {
            name: 'Ceará',
            code: 'CE',
          },
          {
            name: 'Distrito Federal',
            code: 'DF',
          },
          {
            name: 'Espírito Santo',
            code: 'ES',
          },
          {
            name: 'Goiás',
            code: 'GO',
          },
          {
            name: 'Maranhão',
            code: 'MA',
          },
          {
            name: 'Mato Grosso',
            code: 'MT',
          },
          {
            name: 'Mato Grosso do Sul',
            code: 'MS',
          },
          {
            name: 'Minas Gerais',
            code: 'MG',
          },
          {
            name: 'Pará',
            code: 'PA',
          },
          {
            name: 'Paraíba',
            code: 'PB',
          },
          {
            name: 'Paraná',
            code: 'PR',
          },
          {
            name: 'Pernambuco',
            code: 'PE',
          },
          {
            name: 'Piauí',
            code: 'PI',
          },
          {
            name: 'Rio Grande do Norte',
            code: 'RN',
          },
          {
            name: 'Rio Grande do Sul',
            code: 'RS',
          },
          {
            name: 'Rio de Janeiro',
            code: 'RJ',
          },
          {
            name: 'Rondônia',
            code: 'RO',
          },
          {
            name: 'Roraima',
            code: 'RR',
          },
          {
            name: 'Santa Catarina',
            code: 'SC',
          },
          {
            name: 'São Paulo',
            code: 'SP',
          },
          {
            name: 'Sergipe',
            code: 'SE',
          },
          {
            name: 'Tocantins',
            code: 'TO',
          },
        ],
        continent: 'South America',
      },
      {
        name: 'ブルガリア',
        code: 'BG',
        phoneNumberPrefix: 359,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ブルキナファソ',
        code: 'BF',
        phoneNumberPrefix: 226,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ブルネイ',
        code: 'BN',
        phoneNumberPrefix: 673,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ブルンジ',
        code: 'BI',
        phoneNumberPrefix: 257,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ブータン',
        code: 'BT',
        phoneNumberPrefix: 975,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ブーベ島',
        code: 'BV',
        phoneNumberPrefix: 55,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ベトナム',
        code: 'VN',
        phoneNumberPrefix: 84,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ベナン',
        code: 'BJ',
        phoneNumberPrefix: 229,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ベネズエラ',
        code: 'VE',
        phoneNumberPrefix: 58,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'ベラルーシ',
        code: 'BY',
        phoneNumberPrefix: 375,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ベリーズ',
        code: 'BZ',
        phoneNumberPrefix: 501,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ベルギー',
        code: 'BE',
        phoneNumberPrefix: 32,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ペルー',
        code: 'PE',
        phoneNumberPrefix: 51,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Amazonas',
            code: 'PE-AMA',
          },
          {
            name: 'Áncash',
            code: 'PE-ANC',
          },
          {
            name: 'Apurímac',
            code: 'PE-APU',
          },
          {
            name: 'Arequipa',
            code: 'PE-ARE',
          },
          {
            name: 'Ayacucho',
            code: 'PE-AYA',
          },
          {
            name: 'Cajamarca',
            code: 'PE-CAJ',
          },
          {
            name: 'Callao',
            code: 'PE-CAL',
          },
          {
            name: 'Cuzco',
            code: 'PE-CUS',
          },
          {
            name: 'Huancavelica',
            code: 'PE-HUV',
          },
          {
            name: 'Huánuco',
            code: 'PE-HUC',
          },
          {
            name: 'Ica',
            code: 'PE-ICA',
          },
          {
            name: 'Junín',
            code: 'PE-JUN',
          },
          {
            name: 'La Libertad',
            code: 'PE-LAL',
          },
          {
            name: 'Lambayeque',
            code: 'PE-LAM',
          },
          {
            name: 'Lima (departamento)',
            code: 'PE-LIM',
          },
          {
            name: 'Lima (provincia)',
            code: 'PE-LMA',
          },
          {
            name: 'Loreto',
            code: 'PE-LOR',
          },
          {
            name: 'Madre de Dios',
            code: 'PE-MDD',
          },
          {
            name: 'Moquegua',
            code: 'PE-MOQ',
          },
          {
            name: 'Pasco',
            code: 'PE-PAS',
          },
          {
            name: 'Piura',
            code: 'PE-PIU',
          },
          {
            name: 'Puno',
            code: 'PE-PUN',
          },
          {
            name: 'San Martín',
            code: 'PE-SAM',
          },
          {
            name: 'Tacna',
            code: 'PE-TAC',
          },
          {
            name: 'Tumbes',
            code: 'PE-TUM',
          },
          {
            name: 'Ucayali',
            code: 'PE-UCA',
          },
        ],
        continent: 'South America',
      },
      {
        name: 'ホンジュラス',
        code: 'HN',
        phoneNumberPrefix: 504,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'ボスニア・ヘルツェゴビナ',
        code: 'BA',
        phoneNumberPrefix: 387,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ボツワナ',
        code: 'BW',
        phoneNumberPrefix: 267,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ボリビア',
        code: 'BO',
        phoneNumberPrefix: 591,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: 'ポルトガル',
        code: 'PT',
        phoneNumberPrefix: 351,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Açores',
            code: 'PT-20',
          },
          {
            name: 'Aveiro',
            code: 'PT-01',
          },
          {
            name: 'Beja',
            code: 'PT-02',
          },
          {
            name: 'Braga',
            code: 'PT-03',
          },
          {
            name: 'Bragança',
            code: 'PT-04',
          },
          {
            name: 'Castelo Branco',
            code: 'PT-05',
          },
          {
            name: 'Coimbra',
            code: 'PT-06',
          },
          {
            name: 'Évora',
            code: 'PT-07',
          },
          {
            name: 'Faro',
            code: 'PT-08',
          },
          {
            name: 'Guarda',
            code: 'PT-09',
          },
          {
            name: 'Leiria',
            code: 'PT-10',
          },
          {
            name: 'Lisboa',
            code: 'PT-11',
          },
          {
            name: 'Madeira',
            code: 'PT-30',
          },
          {
            name: 'Portalegre',
            code: 'PT-12',
          },
          {
            name: 'Porto',
            code: 'PT-13',
          },
          {
            name: 'Santarém',
            code: 'PT-14',
          },
          {
            name: 'Setúbal',
            code: 'PT-15',
          },
          {
            name: 'Viana do Castelo',
            code: 'PT-16',
          },
          {
            name: 'Vila Real',
            code: 'PT-17',
          },
          {
            name: 'Viseu',
            code: 'PT-18',
          },
        ],
        continent: 'Europe',
      },
      {
        name: 'ポーランド',
        code: 'PL',
        phoneNumberPrefix: 48,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'マケドニア',
        code: 'MK',
        phoneNumberPrefix: 389,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'マダガスカル',
        code: 'MG',
        phoneNumberPrefix: 261,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'マヨット島',
        code: 'YT',
        phoneNumberPrefix: 262,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'マラウイ',
        code: 'MW',
        phoneNumberPrefix: 265,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'マリ',
        code: 'ML',
        phoneNumberPrefix: 223,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'マルタ',
        code: 'MT',
        phoneNumberPrefix: 356,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'マルティニーク',
        code: 'MQ',
        phoneNumberPrefix: 596,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'マレーシア',
        code: 'MY',
        phoneNumberPrefix: 60,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE_AND_TERRITORY',
        zipKey: 'POSTCODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Johor',
            code: 'JHR',
          },
          {
            name: 'Kedah',
            code: 'KDH',
          },
          {
            name: 'Kelantan',
            code: 'KTN',
          },
          {
            name: 'Kuala Lumpur',
            code: 'KUL',
          },
          {
            name: 'Labuan',
            code: 'LBN',
          },
          {
            name: 'Melaka',
            code: 'MLK',
          },
          {
            name: 'Negeri Sembilan',
            code: 'NSN',
          },
          {
            name: 'Pahang',
            code: 'PHG',
          },
          {
            name: 'Perak',
            code: 'PRK',
          },
          {
            name: 'Perlis',
            code: 'PLS',
          },
          {
            name: 'Pulau Pinang',
            code: 'PNG',
          },
          {
            name: 'Putrajaya',
            code: 'PJY',
          },
          {
            name: 'Sabah',
            code: 'SBH',
          },
          {
            name: 'Sarawak',
            code: 'SWK',
          },
          {
            name: 'Selangor',
            code: 'SGR',
          },
          {
            name: 'Terengganu',
            code: 'TRG',
          },
        ],
        continent: 'Asia',
      },
      {
        name: 'マン島',
        code: 'IM',
        phoneNumberPrefix: 44,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ミャンマー',
        code: 'MM',
        phoneNumberPrefix: 95,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'メキシコ',
        code: 'MX',
        phoneNumberPrefix: 52,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Aguascalientes',
            code: 'AGS',
          },
          {
            name: 'Baja California',
            code: 'BC',
          },
          {
            name: 'Baja California Sur',
            code: 'BCS',
          },
          {
            name: 'Campeche',
            code: 'CAMP',
          },
          {
            name: 'Chiapas',
            code: 'CHIS',
          },
          {
            name: 'Chihuahua',
            code: 'CHIH',
          },
          {
            name: 'Ciudad de México',
            code: 'DF',
          },
          {
            name: 'Coahuila',
            code: 'COAH',
          },
          {
            name: 'Colima',
            code: 'COL',
          },
          {
            name: 'Durango',
            code: 'DGO',
          },
          {
            name: 'Guanajuato',
            code: 'GTO',
          },
          {
            name: 'Guerrero',
            code: 'GRO',
          },
          {
            name: 'Hidalgo',
            code: 'HGO',
          },
          {
            name: 'Jalisco',
            code: 'JAL',
          },
          {
            name: 'México',
            code: 'MEX',
          },
          {
            name: 'Michoacán',
            code: 'MICH',
          },
          {
            name: 'Morelos',
            code: 'MOR',
          },
          {
            name: 'Nayarit',
            code: 'NAY',
          },
          {
            name: 'Nuevo León',
            code: 'NL',
          },
          {
            name: 'Oaxaca',
            code: 'OAX',
          },
          {
            name: 'Puebla',
            code: 'PUE',
          },
          {
            name: 'Querétaro',
            code: 'QRO',
          },
          {
            name: 'Quintana Roo',
            code: 'Q ROO',
          },
          {
            name: 'San Luis Potosí',
            code: 'SLP',
          },
          {
            name: 'Sinaloa',
            code: 'SIN',
          },
          {
            name: 'Sonora',
            code: 'SON',
          },
          {
            name: 'Tabasco',
            code: 'TAB',
          },
          {
            name: 'Tamaulipas',
            code: 'TAMPS',
          },
          {
            name: 'Tlaxcala',
            code: 'TLAX',
          },
          {
            name: 'Veracruz',
            code: 'VER',
          },
          {
            name: 'Yucatán',
            code: 'YUC',
          },
          {
            name: 'Zacatecas',
            code: 'ZAC',
          },
        ],
        continent: 'North America',
      },
      {
        name: 'モザンビーク',
        code: 'MZ',
        phoneNumberPrefix: 258,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'モナコ',
        code: 'MC',
        phoneNumberPrefix: 377,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'モルディブ',
        code: 'MV',
        phoneNumberPrefix: 960,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'モルドバ',
        code: 'MD',
        phoneNumberPrefix: 373,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'モロッコ',
        code: 'MA',
        phoneNumberPrefix: 212,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'モンゴル',
        code: 'MN',
        phoneNumberPrefix: 976,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'モンテネグロ',
        code: 'ME',
        phoneNumberPrefix: 382,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'モントセラト',
        code: 'MS',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: 'モーリシャス',
        code: 'MU',
        phoneNumberPrefix: 230,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'モーリタニア',
        code: 'MR',
        phoneNumberPrefix: 222,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ヨルダン',
        code: 'JO',
        phoneNumberPrefix: 962,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ラオス',
        code: 'LA',
        phoneNumberPrefix: 856,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'ラトビア',
        code: 'LV',
        phoneNumberPrefix: 371,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'リトアニア',
        code: 'LT',
        phoneNumberPrefix: 370,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'リヒテンシュタイン',
        code: 'LI',
        phoneNumberPrefix: 423,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'リビア',
        code: 'LY',
        phoneNumberPrefix: 218,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'リベリア',
        code: 'LR',
        phoneNumberPrefix: 231,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ルクセンブルグ',
        code: 'LU',
        phoneNumberPrefix: 352,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ルワンダ',
        code: 'RW',
        phoneNumberPrefix: 250,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'ルーマニア',
        code: 'RO',
        phoneNumberPrefix: 40,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'COUNTY',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Alba',
            code: 'AB',
          },
          {
            name: 'Arad',
            code: 'AR',
          },
          {
            name: 'Argeș',
            code: 'AG',
          },
          {
            name: 'Bacău',
            code: 'BC',
          },
          {
            name: 'Bihor',
            code: 'BH',
          },
          {
            name: 'Bistrița-Năsăud',
            code: 'BN',
          },
          {
            name: 'Botoșani',
            code: 'BT',
          },
          {
            name: 'Brăila',
            code: 'BR',
          },
          {
            name: 'Brașov',
            code: 'BV',
          },
          {
            name: 'București',
            code: 'B',
          },
          {
            name: 'Buzău',
            code: 'BZ',
          },
          {
            name: 'Caraș-Severin',
            code: 'CS',
          },
          {
            name: 'Cluj',
            code: 'CJ',
          },
          {
            name: 'Constanța',
            code: 'CT',
          },
          {
            name: 'Covasna',
            code: 'CV',
          },
          {
            name: 'Călărași',
            code: 'CL',
          },
          {
            name: 'Dolj',
            code: 'DJ',
          },
          {
            name: 'Dâmbovița',
            code: 'DB',
          },
          {
            name: 'Galați',
            code: 'GL',
          },
          {
            name: 'Giurgiu',
            code: 'GR',
          },
          {
            name: 'Gorj',
            code: 'GJ',
          },
          {
            name: 'Harghita',
            code: 'HR',
          },
          {
            name: 'Hunedoara',
            code: 'HD',
          },
          {
            name: 'Ialomița',
            code: 'IL',
          },
          {
            name: 'Iași',
            code: 'IS',
          },
          {
            name: 'Ilfov',
            code: 'IF',
          },
          {
            name: 'Maramureș',
            code: 'MM',
          },
          {
            name: 'Mehedinți',
            code: 'MH',
          },
          {
            name: 'Mureș',
            code: 'MS',
          },
          {
            name: 'Neamț',
            code: 'NT',
          },
          {
            name: 'Olt',
            code: 'OT',
          },
          {
            name: 'Prahova',
            code: 'PH',
          },
          {
            name: 'Sălaj',
            code: 'SJ',
          },
          {
            name: 'Satu Mare',
            code: 'SM',
          },
          {
            name: 'Sibiu',
            code: 'SB',
          },
          {
            name: 'Suceava',
            code: 'SV',
          },
          {
            name: 'Teleorman',
            code: 'TR',
          },
          {
            name: 'Timiș',
            code: 'TM',
          },
          {
            name: 'Tulcea',
            code: 'TL',
          },
          {
            name: 'Vâlcea',
            code: 'VL',
          },
          {
            name: 'Vaslui',
            code: 'VS',
          },
          {
            name: 'Vrancea',
            code: 'VN',
          },
        ],
        continent: 'Europe',
      },
      {
        name: 'レソト',
        code: 'LS',
        phoneNumberPrefix: 266,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: 'レバノン',
        code: 'LB',
        phoneNumberPrefix: 961,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: 'レユニオン島',
        code: 'RE',
        phoneNumberPrefix: 262,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Europe',
      },
      {
        name: 'ロシア',
        code: 'RU',
        phoneNumberPrefix: 7,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Altai Krai',
            code: 'ALT',
          },
          {
            name: 'Altai Republic',
            code: 'AL',
          },
          {
            name: 'Amur Oblast',
            code: 'AMU',
          },
          {
            name: 'Arkhangelsk Oblast',
            code: 'ARK',
          },
          {
            name: 'Astrakhan Oblast',
            code: 'AST',
          },
          {
            name: 'Belgorod Oblast',
            code: 'BEL',
          },
          {
            name: 'Bryansk Oblast',
            code: 'BRY',
          },
          {
            name: 'Chechen Republic',
            code: 'CE',
          },
          {
            name: 'Chelyabinsk Oblast',
            code: 'CHE',
          },
          {
            name: 'Chukotka Autonomous Okrug',
            code: 'CHU',
          },
          {
            name: 'Chuvash Republic',
            code: 'CU',
          },
          {
            name: 'Irkutsk Oblast',
            code: 'IRK',
          },
          {
            name: 'Ivanovo Oblast',
            code: 'IVA',
          },
          {
            name: 'Jewish Autonomous Oblast',
            code: 'YEV',
          },
          {
            name: 'Kabardino-Balkarian Republic',
            code: 'KB',
          },
          {
            name: 'Kaliningrad Oblast',
            code: 'KGD',
          },
          {
            name: 'Kaluga Oblast',
            code: 'KLU',
          },
          {
            name: 'Kamchatka Krai',
            code: 'KAM',
          },
          {
            name: 'Karachay–Cherkess Republic',
            code: 'KC',
          },
          {
            name: 'Kemerovo Oblast',
            code: 'KEM',
          },
          {
            name: 'Khabarovsk Krai',
            code: 'KHA',
          },
          {
            name: 'Khanty-Mansi Autonomous Okrug',
            code: 'KHM',
          },
          {
            name: 'Kirov Oblast',
            code: 'KIR',
          },
          {
            name: 'Komi Republic',
            code: 'KO',
          },
          {
            name: 'Kostroma Oblast',
            code: 'KOS',
          },
          {
            name: 'Krasnodar Krai',
            code: 'KDA',
          },
          {
            name: 'Krasnoyarsk Krai',
            code: 'KYA',
          },
          {
            name: 'Kurgan Oblast',
            code: 'KGN',
          },
          {
            name: 'Kursk Oblast',
            code: 'KRS',
          },
          {
            name: 'Leningrad Oblast',
            code: 'LEN',
          },
          {
            name: 'Lipetsk Oblast',
            code: 'LIP',
          },
          {
            name: 'Magadan Oblast',
            code: 'MAG',
          },
          {
            name: 'Mari El Republic',
            code: 'ME',
          },
          {
            name: 'Moscow',
            code: 'MOW',
          },
          {
            name: 'Moscow Oblast',
            code: 'MOS',
          },
          {
            name: 'Murmansk Oblast',
            code: 'MUR',
          },
          {
            name: 'Nizhny Novgorod Oblast',
            code: 'NIZ',
          },
          {
            name: 'Novgorod Oblast',
            code: 'NGR',
          },
          {
            name: 'Novosibirsk Oblast',
            code: 'NVS',
          },
          {
            name: 'Omsk Oblast',
            code: 'OMS',
          },
          {
            name: 'Orenburg Oblast',
            code: 'ORE',
          },
          {
            name: 'Oryol Oblast',
            code: 'ORL',
          },
          {
            name: 'Penza Oblast',
            code: 'PNZ',
          },
          {
            name: 'Perm Krai',
            code: 'PER',
          },
          {
            name: 'Primorsky Krai',
            code: 'PRI',
          },
          {
            name: 'Pskov Oblast',
            code: 'PSK',
          },
          {
            name: 'Republic of Adygeya',
            code: 'AD',
          },
          {
            name: 'Republic of Bashkortostan',
            code: 'BA',
          },
          {
            name: 'Republic of Buryatia',
            code: 'BU',
          },
          {
            name: 'Republic of Dagestan',
            code: 'DA',
          },
          {
            name: 'Republic of Ingushetia',
            code: 'IN',
          },
          {
            name: 'Republic of Kalmykia',
            code: 'KL',
          },
          {
            name: 'Republic of Karelia',
            code: 'KR',
          },
          {
            name: 'Republic of Khakassia',
            code: 'KK',
          },
          {
            name: 'Republic of Mordovia',
            code: 'MO',
          },
          {
            name: 'Republic of North Ossetia–Alania',
            code: 'SE',
          },
          {
            name: 'Republic of Tatarstan',
            code: 'TA',
          },
          {
            name: 'Rostov Oblast',
            code: 'ROS',
          },
          {
            name: 'Ryazan Oblast',
            code: 'RYA',
          },
          {
            name: 'Saint Petersburg',
            code: 'SPE',
          },
          {
            name: 'Sakha Republic (Yakutia)',
            code: 'SA',
          },
          {
            name: 'Sakhalin Oblast',
            code: 'SAK',
          },
          {
            name: 'Samara Oblast',
            code: 'SAM',
          },
          {
            name: 'Saratov Oblast',
            code: 'SAR',
          },
          {
            name: 'Smolensk Oblast',
            code: 'SMO',
          },
          {
            name: 'Stavropol Krai',
            code: 'STA',
          },
          {
            name: 'Sverdlovsk Oblast',
            code: 'SVE',
          },
          {
            name: 'Tambov Oblast',
            code: 'TAM',
          },
          {
            name: 'Tomsk Oblast',
            code: 'TOM',
          },
          {
            name: 'Tula Oblast',
            code: 'TUL',
          },
          {
            name: 'Tver Oblast',
            code: 'TVE',
          },
          {
            name: 'Tyumen Oblast',
            code: 'TYU',
          },
          {
            name: 'Tyva Republic',
            code: 'TY',
          },
          {
            name: 'Udmurtia',
            code: 'UD',
          },
          {
            name: 'Ulyanovsk Oblast',
            code: 'ULY',
          },
          {
            name: 'Vladimir Oblast',
            code: 'VLA',
          },
          {
            name: 'Volgograd Oblast',
            code: 'VGG',
          },
          {
            name: 'Vologda Oblast',
            code: 'VLG',
          },
          {
            name: 'Voronezh Oblast',
            code: 'VOR',
          },
          {
            name: 'Yamalo-Nenets Autonomous Okrug',
            code: 'YAN',
          },
          {
            name: 'Yaroslavl Oblast',
            code: 'YAR',
          },
          {
            name: 'Zabaykalsky Krai',
            code: 'ZAB',
          },
        ],
        continent: 'Asia',
      },
      {
        name: '中国',
        code: 'CN',
        phoneNumberPrefix: 86,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1} {address2} {city}_{zip} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Anhui',
            code: 'AH',
          },
          {
            name: 'Beijing',
            code: 'BJ',
          },
          {
            name: 'Chongqing',
            code: 'CQ',
          },
          {
            name: 'Fujian',
            code: 'FJ',
          },
          {
            name: 'Gansu',
            code: 'GS',
          },
          {
            name: 'Guangdong',
            code: 'GD',
          },
          {
            name: 'Guangxi',
            code: 'GX',
          },
          {
            name: 'Guizhou',
            code: 'GZ',
          },
          {
            name: 'Hainan',
            code: 'HI',
          },
          {
            name: 'Hebei',
            code: 'HE',
          },
          {
            name: 'Heilongjiang',
            code: 'HL',
          },
          {
            name: 'Henan',
            code: 'HA',
          },
          {
            name: 'Hubei',
            code: 'HB',
          },
          {
            name: 'Hunan',
            code: 'HN',
          },
          {
            name: 'Inner Mongolia',
            code: 'NM',
          },
          {
            name: 'Jiangsu',
            code: 'JS',
          },
          {
            name: 'Jiangxi',
            code: 'JX',
          },
          {
            name: 'Jilin',
            code: 'JL',
          },
          {
            name: 'Liaoning',
            code: 'LN',
          },
          {
            name: 'Ningxia',
            code: 'NX',
          },
          {
            name: 'Qinghai',
            code: 'QH',
          },
          {
            name: 'Shaanxi',
            code: 'SN',
          },
          {
            name: 'Shandong',
            code: 'SD',
          },
          {
            name: 'Shanghai',
            code: 'SH',
          },
          {
            name: 'Shanxi',
            code: 'SX',
          },
          {
            name: 'Sichuan',
            code: 'SC',
          },
          {
            name: 'Tianjin',
            code: 'TJ',
          },
          {
            name: 'Xinjiang',
            code: 'XJ',
          },
          {
            name: 'Xizang',
            code: 'YZ',
          },
          {
            name: 'Yunnan',
            code: 'YN',
          },
          {
            name: 'Zhejiang',
            code: 'ZJ',
          },
        ],
        continent: 'Asia',
      },
      {
        name: '中央アフリカ共和国',
        code: 'CF',
        phoneNumberPrefix: 236,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: '中華人民共和国マカオ特別行政区',
        code: 'MO',
        phoneNumberPrefix: 853,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: '中華人民共和国香港特別行政区',
        code: 'HK',
        phoneNumberPrefix: 852,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province} {country}_{phone}',
        },
        zones: [
          {
            name: 'Hong Kong Island',
            code: 'HK',
          },
          {
            name: 'Kowloon',
            code: 'KL',
          },
          {
            name: 'New Territories',
            code: 'NT',
          },
        ],
        continent: 'Asia',
      },
      {
        name: '仏領ギアナ',
        code: 'GF',
        phoneNumberPrefix: 594,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'South America',
      },
      {
        name: '仏領ポリネシア',
        code: 'PF',
        phoneNumberPrefix: 689,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: '仏領極南諸島',
        code: 'TF',
        phoneNumberPrefix: 262,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Other',
      },
      {
        name: '南アフリカ',
        code: 'ZA',
        phoneNumberPrefix: 27,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Eastern Cape',
            code: 'EC',
          },
          {
            name: 'Free State',
            code: 'FS',
          },
          {
            name: 'Gauteng',
            code: 'GT',
          },
          {
            name: 'KwaZulu-Natal',
            code: 'NL',
          },
          {
            name: 'Limpopo',
            code: 'LP',
          },
          {
            name: 'Mpumalanga',
            code: 'MP',
          },
          {
            name: 'North West',
            code: 'NW',
          },
          {
            name: 'Northern Cape',
            code: 'NC',
          },
          {
            name: 'Western Cape',
            code: 'WC',
          },
        ],
        continent: 'Africa',
      },
      {
        name: '南ジョージア島・南サンドイッチ諸島',
        code: 'GS',
        phoneNumberPrefix: 500,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Other',
      },
      {
        name: '南スーダン',
        code: 'SS',
        phoneNumberPrefix: 211,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: '台湾',
        code: 'TW',
        phoneNumberPrefix: 886,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: '大韓民国',
        code: 'KR',
        phoneNumberPrefix: 82,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PROVINCE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{company}_{lastName}{firstName}_{zip}_{country}_{province}{city}_{address1}_{address2}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'Busan',
            code: 'KR-26',
          },
          {
            name: 'Chungbuk',
            code: 'KR-43',
          },
          {
            name: 'Chungnam',
            code: 'KR-44',
          },
          {
            name: 'Daegu',
            code: 'KR-27',
          },
          {
            name: 'Daejeon',
            code: 'KR-30',
          },
          {
            name: 'Gangwon',
            code: 'KR-42',
          },
          {
            name: 'Gwangju',
            code: 'KR-29',
          },
          {
            name: 'Gyeongbuk',
            code: 'KR-47',
          },
          {
            name: 'Gyeonggi',
            code: 'KR-41',
          },
          {
            name: 'Gyeongnam',
            code: 'KR-48',
          },
          {
            name: 'Incheon',
            code: 'KR-28',
          },
          {
            name: 'Jeju',
            code: 'KR-49',
          },
          {
            name: 'Jeonbuk',
            code: 'KR-45',
          },
          {
            name: 'Jeonnam',
            code: 'KR-46',
          },
          {
            name: 'Sejong',
            code: 'KR-50',
          },
          {
            name: 'Seoul',
            code: 'KR-11',
          },
          {
            name: 'Ulsan',
            code: 'KR-31',
          },
        ],
        continent: 'Asia',
      },
      {
        name: '日本',
        code: 'JP',
        phoneNumberPrefix: 81,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'PREFECTURE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{company}_{lastName}{firstName}_{zip}_{country}_{province}{city}_{address1}_{address2}_{phone}',
          show:
            '{country}_〒{zip} {province} {city} {address1} {address2}_{company}_{lastName} {firstName}様_{phone}',
        },
        zones: [
          {
            name: '北海道',
            code: 'JP-01',
          },
          {
            name: '青森県',
            code: 'JP-02',
          },
          {
            name: '岩手県',
            code: 'JP-03',
          },
          {
            name: '宮城県',
            code: 'JP-04',
          },
          {
            name: '秋田県',
            code: 'JP-05',
          },
          {
            name: '山形県',
            code: 'JP-06',
          },
          {
            name: '福島県',
            code: 'JP-07',
          },
          {
            name: '茨城県',
            code: 'JP-08',
          },
          {
            name: '栃木県',
            code: 'JP-09',
          },
          {
            name: '群馬県',
            code: 'JP-10',
          },
          {
            name: '埼玉県',
            code: 'JP-11',
          },
          {
            name: '千葉県',
            code: 'JP-12',
          },
          {
            name: '東京都',
            code: 'JP-13',
          },
          {
            name: '神奈川県',
            code: 'JP-14',
          },
          {
            name: '新潟県',
            code: 'JP-15',
          },
          {
            name: '富山県',
            code: 'JP-16',
          },
          {
            name: '石川県',
            code: 'JP-17',
          },
          {
            name: '福井県',
            code: 'JP-18',
          },
          {
            name: '山梨県',
            code: 'JP-19',
          },
          {
            name: '長野県',
            code: 'JP-20',
          },
          {
            name: '岐阜県',
            code: 'JP-21',
          },
          {
            name: '静岡県',
            code: 'JP-22',
          },
          {
            name: '愛知県',
            code: 'JP-23',
          },
          {
            name: '三重県',
            code: 'JP-24',
          },
          {
            name: '滋賀県',
            code: 'JP-25',
          },
          {
            name: '京都府',
            code: 'JP-26',
          },
          {
            name: '大阪府',
            code: 'JP-27',
          },
          {
            name: '兵庫県',
            code: 'JP-28',
          },
          {
            name: '奈良県',
            code: 'JP-29',
          },
          {
            name: '和歌山県',
            code: 'JP-30',
          },
          {
            name: '鳥取県',
            code: 'JP-31',
          },
          {
            name: '島根県',
            code: 'JP-32',
          },
          {
            name: '岡山県',
            code: 'JP-33',
          },
          {
            name: '広島県',
            code: 'JP-34',
          },
          {
            name: '山口県',
            code: 'JP-35',
          },
          {
            name: '徳島県',
            code: 'JP-36',
          },
          {
            name: '香川県',
            code: 'JP-37',
          },
          {
            name: '愛媛県',
            code: 'JP-38',
          },
          {
            name: '高知県',
            code: 'JP-39',
          },
          {
            name: '福岡県',
            code: 'JP-40',
          },
          {
            name: '佐賀県',
            code: 'JP-41',
          },
          {
            name: '長崎県',
            code: 'JP-42',
          },
          {
            name: '熊本県',
            code: 'JP-43',
          },
          {
            name: '大分県',
            code: 'JP-44',
          },
          {
            name: '宮崎県',
            code: 'JP-45',
          },
          {
            name: '鹿児島県',
            code: 'JP-46',
          },
          {
            name: '沖縄県',
            code: 'JP-47',
          },
        ],
        continent: 'Asia',
      },
      {
        name: '朝鮮民主主義人民共和国',
        code: 'KP',
        phoneNumberPrefix: 82,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: '東ティモール',
        code: 'TL',
        phoneNumberPrefix: 670,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Oceania',
      },
      {
        name: '米領太平洋諸島',
        code: 'UM',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'STATE',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: '英領インド洋地域',
        code: 'IO',
        phoneNumberPrefix: 246,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Asia',
      },
      {
        name: '英領ヴァージン諸島',
        code: 'VG',
        phoneNumberPrefix: 1,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        continent: 'Central America',
      },
      {
        name: '西サハラ',
        code: 'EH',
        phoneNumberPrefix: 212,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
      {
        name: '赤道ギニア',
        code: 'GQ',
        phoneNumberPrefix: 240,
        address2Key: 'APT_SUITE_ETC',
        provinceKey: 'REGION',
        zipKey: 'POSTAL_CODE',
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        continent: 'Africa',
      },
    ],
  },
};

export default data;
