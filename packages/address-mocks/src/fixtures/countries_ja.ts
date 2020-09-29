const data = {
  data: {
    countries: [
      {
        name: 'アイスランド',
        code: 'IS',
        phoneNumberPrefix: 354,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アイルランド',
        code: 'IE',
        phoneNumberPrefix: 353,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'カーロウ州',
            code: 'CW',
          },
          {
            name: 'キャバン州',
            code: 'CN',
          },
          {
            name: 'クレア州',
            code: 'CE',
          },
          {
            name: 'コーク州',
            code: 'CO',
          },
          {
            name: 'ドニゴール州',
            code: 'DL',
          },
          {
            name: 'ダブリン州',
            code: 'D',
          },
          {
            name: 'ゴールウェイ州',
            code: 'G',
          },
          {
            name: 'ケリー州',
            code: 'KY',
          },
          {
            name: 'キルデア州',
            code: 'KE',
          },
          {
            name: 'キルケニー州',
            code: 'KK',
          },
          {
            name: 'ラオース州',
            code: 'LS',
          },
          {
            name: 'リートリム州',
            code: 'LM',
          },
          {
            name: 'リムリック州',
            code: 'LK',
          },
          {
            name: 'ロングフォード州',
            code: 'LD',
          },
          {
            name: 'ラウス州',
            code: 'LH',
          },
          {
            name: 'メイヨー州',
            code: 'MO',
          },
          {
            name: 'ミース州',
            code: 'MH',
          },
          {
            name: 'モナハン州',
            code: 'MN',
          },
          {
            name: 'オファリー州',
            code: 'OY',
          },
          {
            name: 'ロスコモン州',
            code: 'RN',
          },
          {
            name: 'スライゴ州',
            code: 'SO',
          },
          {
            name: 'ティペラリー州',
            code: 'TA',
          },
          {
            name: 'ウォーターフォード州',
            code: 'WD',
          },
          {
            name: 'ウェストミース州',
            code: 'WH',
          },
          {
            name: 'ウェックスフォード州',
            code: 'WX',
          },
          {
            name: 'ウィックロー州',
            code: 'WW',
          },
        ],
        provinceKey: 'COUNTY',
      },
      {
        name: 'アゼルバイジャン',
        code: 'AZ',
        phoneNumberPrefix: 994,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アフガニスタン',
        code: 'AF',
        phoneNumberPrefix: 93,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アメリカ合衆国',
        code: 'US',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'North America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            name: 'アラバマ州',
            code: 'AL',
          },
          {
            name: 'アラスカ州',
            code: 'AK',
          },
          {
            name: 'American Samoa',
            code: 'AS',
          },
          {
            name: 'アリゾナ州',
            code: 'AZ',
          },
          {
            name: 'アーカンソー州',
            code: 'AR',
          },
          {
            name: 'カリフォルニア州',
            code: 'CA',
          },
          {
            name: 'コロラド州',
            code: 'CO',
          },
          {
            name: 'コネチカット州',
            code: 'CT',
          },
          {
            name: 'デラウェア州',
            code: 'DE',
          },
          {
            name: 'Washington DC',
            code: 'DC',
          },
          {
            name: 'ミクロネシア連邦',
            code: 'FM',
          },
          {
            name: 'フロリダ州',
            code: 'FL',
          },
          {
            name: 'ジョージア州',
            code: 'GA',
          },
          {
            name: 'Guam',
            code: 'GU',
          },
          {
            name: 'ハワイ州',
            code: 'HI',
          },
          {
            name: 'アイダホ州',
            code: 'ID',
          },
          {
            name: 'イリノイ州',
            code: 'IL',
          },
          {
            name: 'インディアナ州',
            code: 'IN',
          },
          {
            name: 'アイオワ州',
            code: 'IA',
          },
          {
            name: 'カンザス州',
            code: 'KS',
          },
          {
            name: 'ケンタッキー州',
            code: 'KY',
          },
          {
            name: 'ルイジアナ州',
            code: 'LA',
          },
          {
            name: 'メイン州',
            code: 'ME',
          },
          {
            name: 'マーシャル諸島',
            code: 'MH',
          },
          {
            name: 'メリーランド州',
            code: 'MD',
          },
          {
            name: 'マサチューセッツ州',
            code: 'MA',
          },
          {
            name: 'ミシガン州',
            code: 'MI',
          },
          {
            name: 'ミネソタ州',
            code: 'MN',
          },
          {
            name: 'ミシシッピ州',
            code: 'MS',
          },
          {
            name: 'ミズーリ州',
            code: 'MO',
          },
          {
            name: 'モンタナ州',
            code: 'MT',
          },
          {
            name: 'ネブラスカ州',
            code: 'NE',
          },
          {
            name: 'ネバダ州',
            code: 'NV',
          },
          {
            name: 'ニューハンプシャー州',
            code: 'NH',
          },
          {
            name: 'ニュージャージー州',
            code: 'NJ',
          },
          {
            name: 'ニューメキシコ州',
            code: 'NM',
          },
          {
            name: 'ニューヨーク州',
            code: 'NY',
          },
          {
            name: 'ノースカロライナ州',
            code: 'NC',
          },
          {
            name: 'ノースダコタ州',
            code: 'ND',
          },
          {
            name: 'Northern Mariana Islands',
            code: 'MP',
          },
          {
            name: 'オハイオ州',
            code: 'OH',
          },
          {
            name: 'オクラホマ州',
            code: 'OK',
          },
          {
            name: 'オレゴン州',
            code: 'OR',
          },
          {
            name: 'パラオ',
            code: 'PW',
          },
          {
            name: 'ペンシルベニア州',
            code: 'PA',
          },
          {
            name: 'Puerto Rico',
            code: 'PR',
          },
          {
            name: 'ロードアイランド州',
            code: 'RI',
          },
          {
            name: 'サウスカロライナ州',
            code: 'SC',
          },
          {
            name: 'サウスダコタ州',
            code: 'SD',
          },
          {
            name: 'テネシー州',
            code: 'TN',
          },
          {
            name: 'テキサス州',
            code: 'TX',
          },
          {
            name: 'ユタ州',
            code: 'UT',
          },
          {
            name: 'バーモント州',
            code: 'VT',
          },
          {
            name: 'U.S. Virgin Islands',
            code: 'VI',
          },
          {
            name: 'バージニア州',
            code: 'VA',
          },
          {
            name: 'ワシントン州',
            code: 'WA',
          },
          {
            name: 'ウェストバージニア州',
            code: 'WV',
          },
          {
            name: 'ウィスコンシン州',
            code: 'WI',
          },
          {
            name: 'ワイオミング州',
            code: 'WY',
          },
          {
            name: 'アメリカ軍',
            code: 'AA',
          },
          {
            name: '欧州戦力',
            code: 'AE',
          },
          {
            name: '太平洋方面駐在軍',
            code: 'AP',
          },
        ],
        provinceKey: 'STATE',
      },
      {
        name: 'アラブ首長国連邦',
        code: 'AE',
        phoneNumberPrefix: 971,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '首長国',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アブダビ',
            code: 'AZ',
          },
          {
            name: 'アジュマーン',
            code: 'AJ',
          },
          {
            name: 'ドバイ首長国',
            code: 'DU',
          },
          {
            name: 'フジャイラ',
            code: 'FU',
          },
          {
            name: 'Ras al-Khaimah',
            code: 'RK',
          },
          {
            name: 'シャールジャ',
            code: 'SH',
          },
          {
            name: 'Umm al-Quwain',
            code: 'UQ',
          },
        ],
        provinceKey: 'EMIRATE',
      },
      {
        name: 'アルジェリア',
        code: 'DZ',
        phoneNumberPrefix: 213,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'アルゼンチン',
        code: 'AR',
        phoneNumberPrefix: 54,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{province}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'ブエノスアイレス州',
            code: 'B',
          },
          {
            name: 'カタマルカ州',
            code: 'K',
          },
          {
            name: 'チャコ州',
            code: 'H',
          },
          {
            name: 'チュブ州',
            code: 'U',
          },
          {
            name: 'ブエノスアイレス自治都市',
            code: 'C',
          },
          {
            name: 'コルドバ州',
            code: 'X',
          },
          {
            name: 'コリエンテス州',
            code: 'W',
          },
          {
            name: 'エントレ・リオス州',
            code: 'E',
          },
          {
            name: 'フォルモサ州',
            code: 'P',
          },
          {
            name: 'フフイ州',
            code: 'Y',
          },
          {
            name: 'ラ・パンパ州',
            code: 'L',
          },
          {
            name: 'ラ・リオハ州',
            code: 'F',
          },
          {
            name: 'メンドーサ州',
            code: 'M',
          },
          {
            name: 'ミシオネス州',
            code: 'N',
          },
          {
            name: 'ネウケン州',
            code: 'Q',
          },
          {
            name: 'リオネグロ州',
            code: 'R',
          },
          {
            name: 'サルタ州',
            code: 'A',
          },
          {
            name: 'サンフアン州',
            code: 'J',
          },
          {
            name: 'サンルイス州',
            code: 'D',
          },
          {
            name: 'サンタクルス州',
            code: 'Z',
          },
          {
            name: 'サンタフェ州',
            code: 'S',
          },
          {
            name: 'サンティアゴ・デル・エステロ州',
            code: 'G',
          },
          {
            name: 'ティエラ・デル・フエゴ州',
            code: 'V',
          },
          {
            name: 'トゥクマン州',
            code: 'T',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'アルバ',
        code: 'AW',
        phoneNumberPrefix: 297,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アルバニア',
        code: 'AL',
        phoneNumberPrefix: 355,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アルメニア',
        code: 'AM',
        phoneNumberPrefix: 374,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アンギラ',
        code: 'AI',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アンゴラ',
        code: 'AO',
        phoneNumberPrefix: 244,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アンティグア・バーブーダ',
        code: 'AG',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'アンドラ',
        code: 'AD',
        phoneNumberPrefix: 376,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'イエメン',
        code: 'YE',
        phoneNumberPrefix: 967,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'イギリス',
        code: 'GB',
        phoneNumberPrefix: 44,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'イスラエル',
        code: 'IL',
        phoneNumberPrefix: 972,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'イタリア',
        code: 'IT',
        phoneNumberPrefix: 39,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}{province}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アグリジェント県',
            code: 'AG',
          },
          {
            name: 'アレッサンドリア県',
            code: 'AL',
          },
          {
            name: 'アンコーナ県',
            code: 'AN',
          },
          {
            name: 'アオスタ',
            code: 'AO',
          },
          {
            name: 'アレッツォ県',
            code: 'AR',
          },
          {
            name: 'アスコリ・ピチェーノ県',
            code: 'AP',
          },
          {
            name: 'アスティ県',
            code: 'AT',
          },
          {
            name: 'アヴェッリーノ県',
            code: 'AV',
          },
          {
            name: 'バーリ県',
            code: 'BA',
          },
          {
            name: 'Barletta-Andria-Trani',
            code: 'BT',
          },
          {
            name: 'ベッルーノ県',
            code: 'BL',
          },
          {
            name: 'ベネヴェント県',
            code: 'BN',
          },
          {
            name: 'ベルガモ県',
            code: 'BG',
          },
          {
            name: 'ビエッラ県',
            code: 'BI',
          },
          {
            name: 'ボローニャ県',
            code: 'BO',
          },
          {
            name: 'ボルツァーノ自治県',
            code: 'BZ',
          },
          {
            name: 'ブレシア県',
            code: 'BS',
          },
          {
            name: 'ブリンディジ県',
            code: 'BR',
          },
          {
            name: 'カリャリ県',
            code: 'CA',
          },
          {
            name: 'カルタニッセッタ県',
            code: 'CL',
          },
          {
            name: 'カンポバッソ県',
            code: 'CB',
          },
          {
            name: 'Carbonia-Iglesias',
            code: 'CI',
          },
          {
            name: 'カゼルタ県',
            code: 'CE',
          },
          {
            name: 'カターニア県',
            code: 'CT',
          },
          {
            name: 'カタンザーロ県',
            code: 'CZ',
          },
          {
            name: 'キエーティ県',
            code: 'CH',
          },
          {
            name: 'コモ県',
            code: 'CO',
          },
          {
            name: 'コゼンツァ県',
            code: 'CS',
          },
          {
            name: 'クレモナ県',
            code: 'CR',
          },
          {
            name: 'クロトーネ県',
            code: 'KR',
          },
          {
            name: 'クーネオ県',
            code: 'CN',
          },
          {
            name: 'エンナ県',
            code: 'EN',
          },
          {
            name: 'フェルモ県',
            code: 'FM',
          },
          {
            name: 'フェラーラ県',
            code: 'FE',
          },
          {
            name: 'フィレンツェ県',
            code: 'FI',
          },
          {
            name: 'フォッジャ県',
            code: 'FG',
          },
          {
            name: 'Forlì-Cesena',
            code: 'FC',
          },
          {
            name: 'フロジノーネ県',
            code: 'FR',
          },
          {
            name: 'ジェノヴァ',
            code: 'GE',
          },
          {
            name: 'ゴリツィア県',
            code: 'GO',
          },
          {
            name: 'グロッセート県',
            code: 'GR',
          },
          {
            name: 'インペリア県',
            code: 'IM',
          },
          {
            name: 'イゼルニア県',
            code: 'IS',
          },
          {
            name: 'ラクイラ県',
            code: 'AQ',
          },
          {
            name: 'ラ・スペツィア県',
            code: 'SP',
          },
          {
            name: 'ラティーナ県',
            code: 'LT',
          },
          {
            name: 'レッチェ県',
            code: 'LE',
          },
          {
            name: 'レッコ県',
            code: 'LC',
          },
          {
            name: 'リヴォルノ県',
            code: 'LI',
          },
          {
            name: 'ローディ県',
            code: 'LO',
          },
          {
            name: 'ルッカ県',
            code: 'LU',
          },
          {
            name: 'マチェラータ県',
            code: 'MC',
          },
          {
            name: 'マントヴァ県',
            code: 'MN',
          },
          {
            name: 'Massa and Carrara',
            code: 'MS',
          },
          {
            name: 'マテーラ県',
            code: 'MT',
          },
          {
            name: 'メディオ・カンピダーノ県',
            code: 'VS',
          },
          {
            name: 'メッシーナ県',
            code: 'ME',
          },
          {
            name: 'ミラノ県',
            code: 'MI',
          },
          {
            name: 'モデナ県',
            code: 'MO',
          },
          {
            name: 'モンツァ・エ・ブリアンツァ県',
            code: 'MB',
          },
          {
            name: 'ナポリ県',
            code: 'NA',
          },
          {
            name: 'ノヴァーラ県',
            code: 'NO',
          },
          {
            name: 'ヌーオロ県',
            code: 'NU',
          },
          {
            name: 'オリアストラ県',
            code: 'OG',
          },
          {
            name: 'Olbia-Tempio',
            code: 'OT',
          },
          {
            name: 'オリスターノ県',
            code: 'OR',
          },
          {
            name: 'パドヴァ県',
            code: 'PD',
          },
          {
            name: 'パレルモ県',
            code: 'PA',
          },
          {
            name: 'パルマ県',
            code: 'PR',
          },
          {
            name: 'パヴィーア県',
            code: 'PV',
          },
          {
            name: 'ペルージャ県',
            code: 'PG',
          },
          {
            name: 'ペーザロ・エ・ウルビーノ県',
            code: 'PU',
          },
          {
            name: 'ペスカーラ県',
            code: 'PE',
          },
          {
            name: 'ピアチェンツァ県',
            code: 'PC',
          },
          {
            name: 'ピサ県',
            code: 'PI',
          },
          {
            name: 'ピストイア県',
            code: 'PT',
          },
          {
            name: 'ポルデノーネ県',
            code: 'PN',
          },
          {
            name: 'ポテンツァ県',
            code: 'PZ',
          },
          {
            name: 'プラート県',
            code: 'PO',
          },
          {
            name: 'ラグーザ県',
            code: 'RG',
          },
          {
            name: 'ラヴェンナ県',
            code: 'RA',
          },
          {
            name: 'レッジョ・カラブリア県',
            code: 'RC',
          },
          {
            name: 'レッジョ・エミリア県',
            code: 'RE',
          },
          {
            name: 'リエーティ県',
            code: 'RI',
          },
          {
            name: 'リミニ県',
            code: 'RN',
          },
          {
            name: 'ローマ県',
            code: 'RM',
          },
          {
            name: 'ロヴィーゴ県',
            code: 'RO',
          },
          {
            name: 'サレルノ県',
            code: 'SA',
          },
          {
            name: 'サッサリ県',
            code: 'SS',
          },
          {
            name: 'サヴォーナ県',
            code: 'SV',
          },
          {
            name: 'シエーナ県',
            code: 'SI',
          },
          {
            name: 'シラクーザ県',
            code: 'SR',
          },
          {
            name: 'ソンドリオ県',
            code: 'SO',
          },
          {
            name: 'ターラント県',
            code: 'TA',
          },
          {
            name: 'テーラモ県',
            code: 'TE',
          },
          {
            name: 'テルニ県',
            code: 'TR',
          },
          {
            name: 'トリノ県',
            code: 'TO',
          },
          {
            name: 'トラーパニ県',
            code: 'TP',
          },
          {
            name: 'トレント自治県',
            code: 'TN',
          },
          {
            name: 'トレヴィーゾ県',
            code: 'TV',
          },
          {
            name: 'トリエステ県',
            code: 'TS',
          },
          {
            name: 'ウーディネ県',
            code: 'UD',
          },
          {
            name: 'ヴァレーゼ県',
            code: 'VA',
          },
          {
            name: 'ヴェネツィア県',
            code: 'VE',
          },
          {
            name: 'ヴェルバーノ・クジオ・オッソラ県',
            code: 'VB',
          },
          {
            name: 'ヴェルチェッリ県',
            code: 'VC',
          },
          {
            name: 'ヴェローナ県',
            code: 'VR',
          },
          {
            name: 'ヴィボ・ヴァレンツィア県',
            code: 'VV',
          },
          {
            name: 'ヴィチェンツァ県',
            code: 'VI',
          },
          {
            name: 'ヴィテルボ県',
            code: 'VT',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'イラク',
        code: 'IQ',
        phoneNumberPrefix: 964,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'イラン',
        code: 'IR',
        phoneNumberPrefix: 98,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'インド',
        code: 'IN',
        phoneNumberPrefix: 91,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: 'PINコード',
          zone: '州',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アンダマン・ニコバル諸島',
            code: 'AN',
          },
          {
            name: 'アーンドラ・プラデーシュ州',
            code: 'AP',
          },
          {
            name: 'アルナーチャル・プラデーシュ州',
            code: 'AR',
          },
          {
            name: 'アッサム州',
            code: 'AS',
          },
          {
            name: 'ビハール州',
            code: 'BR',
          },
          {
            name: 'チャンディーガル',
            code: 'CH',
          },
          {
            name: 'チャッティースガル州',
            code: 'CG',
          },
          {
            name: 'ダードラー及びナガル・ハヴェーリー連邦直轄領',
            code: 'DN',
          },
          {
            name: 'ダマン・ディーウ連邦直轄領',
            code: 'DD',
          },
          {
            name: 'デリー',
            code: 'DL',
          },
          {
            name: 'ゴア州',
            code: 'GA',
          },
          {
            name: 'グジャラート州',
            code: 'GJ',
          },
          {
            name: 'ハリヤーナー州',
            code: 'HR',
          },
          {
            name: 'ヒマーチャル・プラデーシュ州',
            code: 'HP',
          },
          {
            name: 'ジャンムー・カシミール州',
            code: 'JK',
          },
          {
            name: 'ジャールカンド州',
            code: 'JH',
          },
          {
            name: 'カルナータカ州',
            code: 'KA',
          },
          {
            name: 'ケーララ州',
            code: 'KL',
          },
          {
            name: 'Ladakh',
            code: 'LA',
          },
          {
            name: 'ラクシャディープ諸島',
            code: 'LD',
          },
          {
            name: 'マディヤ・プラデーシュ州',
            code: 'MP',
          },
          {
            name: 'マハーラーシュトラ州',
            code: 'MH',
          },
          {
            name: 'マニプル州',
            code: 'MN',
          },
          {
            name: 'メーガーラヤ州',
            code: 'ML',
          },
          {
            name: 'ミゾラム州',
            code: 'MZ',
          },
          {
            name: 'ナガランド州',
            code: 'NL',
          },
          {
            name: 'オリッサ州',
            code: 'OR',
          },
          {
            name: 'ポンディシェリ連邦直轄領',
            code: 'PY',
          },
          {
            name: 'パンジャーブ州',
            code: 'PB',
          },
          {
            name: 'ラージャスターン州',
            code: 'RJ',
          },
          {
            name: 'シッキム州',
            code: 'SK',
          },
          {
            name: 'タミル・ナードゥ州',
            code: 'TN',
          },
          {
            name: 'テランガナ',
            code: 'TS',
          },
          {
            name: 'トリプラ州',
            code: 'TR',
          },
          {
            name: 'ウッタル・プラデーシュ州',
            code: 'UP',
          },
          {
            name: 'ウッタラーカンド州',
            code: 'UK',
          },
          {
            name: '西ベンガル州',
            code: 'WB',
          },
        ],
        provinceKey: 'STATE',
      },
      {
        name: 'インドネシア',
        code: 'ID',
        phoneNumberPrefix: 62,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{province}{zip}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アチェ州',
            code: 'AC',
          },
          {
            name: 'バリ州',
            code: 'BA',
          },
          {
            name: 'バンカ・ブリトゥン州',
            code: 'BB',
          },
          {
            name: 'バンテン州',
            code: 'BT',
          },
          {
            name: 'ブンクル州',
            code: 'BE',
          },
          {
            name: 'ゴロンタロ州',
            code: 'GO',
          },
          {
            name: 'ジャカルタ',
            code: 'JK',
          },
          {
            name: 'ジャンビ州',
            code: 'JA',
          },
          {
            name: '西ジャワ州',
            code: 'JB',
          },
          {
            name: '中部ジャワ州',
            code: 'JT',
          },
          {
            name: '東ジャワ州',
            code: 'JI',
          },
          {
            name: '西カリマンタン州',
            code: 'KB',
          },
          {
            name: '南カリマンタン州',
            code: 'KS',
          },
          {
            name: '中部カリマンタン州',
            code: 'KT',
          },
          {
            name: '東カリマンタン州',
            code: 'KI',
          },
          {
            name: '北カリマンタン州',
            code: 'KU',
          },
          {
            name: 'リアウ諸島州',
            code: 'KR',
          },
          {
            name: 'ランプン州',
            code: 'LA',
          },
          {
            name: 'マルク州',
            code: 'MA',
          },
          {
            name: '北マルク州',
            code: 'MU',
          },
          {
            name: '北スマトラ州',
            code: 'SU',
          },
          {
            name: '西ヌサ・トゥンガラ州',
            code: 'NB',
          },
          {
            name: '東ヌサ・トゥンガラ州',
            code: 'NT',
          },
          {
            name: 'パプア州',
            code: 'PA',
          },
          {
            name: '西パプア州',
            code: 'PB',
          },
          {
            name: 'リアウ州',
            code: 'RI',
          },
          {
            name: '南スマトラ州',
            code: 'SS',
          },
          {
            name: '西スラウェシ州',
            code: 'SR',
          },
          {
            name: '南スラウェシ州',
            code: 'SN',
          },
          {
            name: '中部スラウェシ州',
            code: 'ST',
          },
          {
            name: '南東スラウェシ州',
            code: 'SG',
          },
          {
            name: '北スラウェシ州',
            code: 'SA',
          },
          {
            name: '西スマトラ州',
            code: 'SB',
          },
          {
            name: 'ジョグジャカルタ特別州',
            code: 'YO',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'ウォリス・フツナ',
        code: 'WF',
        phoneNumberPrefix: 681,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ウガンダ',
        code: 'UG',
        phoneNumberPrefix: 256,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ウクライナ',
        code: 'UA',
        phoneNumberPrefix: 380,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ウズベキスタン',
        code: 'UZ',
        phoneNumberPrefix: 998,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ウルグアイ',
        code: 'UY',
        phoneNumberPrefix: 598,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'エクアドル',
        code: 'EC',
        phoneNumberPrefix: 593,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'エジプト',
        code: 'EG',
        phoneNumberPrefix: 20,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '行政区域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{province}_{city}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: '10月6日',
            code: 'SU',
          },
          {
            name: 'シャルキーヤ県',
            code: 'SHR',
          },
          {
            name: 'アレクサンドリア県',
            code: 'ALX',
          },
          {
            name: 'アスワン県',
            code: 'ASN',
          },
          {
            name: 'アシュート県',
            code: 'AST',
          },
          {
            name: 'ブハイラ県',
            code: 'BH',
          },
          {
            name: 'ベニ・スエフ県',
            code: 'BNS',
          },
          {
            name: 'カイロ県',
            code: 'C',
          },
          {
            name: 'ダカリーヤ県',
            code: 'DK',
          },
          {
            name: 'ディムヤート県',
            code: 'DT',
          },
          {
            name: 'ファイユーム県',
            code: 'FYM',
          },
          {
            name: 'ガルビーヤ県',
            code: 'GH',
          },
          {
            name: 'ギーザ県',
            code: 'GZ',
          },
          {
            name: 'ヘルワン',
            code: 'HU',
          },
          {
            name: 'イスマイリア県',
            code: 'IS',
          },
          {
            name: 'カフル・アッシャイフ県',
            code: 'KFS',
          },
          {
            name: 'ルクソール県',
            code: 'LX',
          },
          {
            name: 'マトルーフ県',
            code: 'MT',
          },
          {
            name: 'ミニヤー県',
            code: 'MN',
          },
          {
            name: 'ミヌーフィーヤ県',
            code: 'MNF',
          },
          {
            name: 'ニューバレー県',
            code: 'WAD',
          },
          {
            name: '北シナイ県',
            code: 'SIN',
          },
          {
            name: 'ポートサイド県',
            code: 'PTS',
          },
          {
            name: 'カリュービーヤ県',
            code: 'KB',
          },
          {
            name: 'ケナ県',
            code: 'KN',
          },
          {
            name: '紅海県',
            code: 'BA',
          },
          {
            name: 'ソハーグ県',
            code: 'SHG',
          },
          {
            name: '南シナイ県',
            code: 'JS',
          },
          {
            name: 'スエズ県',
            code: 'SUZ',
          },
        ],
        provinceKey: 'GOVERNORATE',
      },
      {
        name: 'エストニア',
        code: 'EE',
        phoneNumberPrefix: 372,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'エスワティニ',
        code: 'SZ',
        phoneNumberPrefix: 268,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'エチオピア',
        code: 'ET',
        phoneNumberPrefix: 251,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'エリトリア',
        code: 'ER',
        phoneNumberPrefix: 291,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'エルサルバドル',
        code: 'SV',
        phoneNumberPrefix: 503,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'オマーン',
        code: 'OM',
        phoneNumberPrefix: 968,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'オランダ',
        code: 'NL',
        phoneNumberPrefix: 31,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'オランダ領アンティル諸島',
        code: 'AN',
        phoneNumberPrefix: 599,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'オランダ領カリブ',
        code: 'BQ',
        phoneNumberPrefix: 599,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'オーストラリア',
        code: 'AU',
        phoneNumberPrefix: 61,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: 'サバーブ',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '州/地区',
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
            name: 'オーストラリア首都特別地域',
            code: 'ACT',
          },
          {
            name: 'ニューサウスウェールズ州',
            code: 'NSW',
          },
          {
            name: 'ノーザンテリトリー',
            code: 'NT',
          },
          {
            name: 'クイーンズランド州',
            code: 'QLD',
          },
          {
            name: '南オーストラリア州',
            code: 'SA',
          },
          {
            name: 'タスマニア州',
            code: 'TAS',
          },
          {
            name: 'ビクトリア州',
            code: 'VIC',
          },
          {
            name: '西オーストラリア州',
            code: 'WA',
          },
        ],
        provinceKey: 'STATE_AND_TERRITORY',
      },
      {
        name: 'オーストリア',
        code: 'AT',
        phoneNumberPrefix: 43,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '住所2',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '住所2 (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'オーランド諸島',
        code: 'AX',
        phoneNumberPrefix: 358,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'カザフスタン',
        code: 'KZ',
        phoneNumberPrefix: 7,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'カタール',
        code: 'QA',
        phoneNumberPrefix: 974,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'カナダ',
        code: 'CA',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'North America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            name: 'アルバータ州',
            code: 'AB',
          },
          {
            name: 'ブリティッシュコロンビア州',
            code: 'BC',
          },
          {
            name: 'マニトバ州',
            code: 'MB',
          },
          {
            name: 'ニューブランズウィック州',
            code: 'NB',
          },
          {
            name: 'ニューファンドランド・ラブラドール州',
            code: 'NL',
          },
          {
            name: 'ノースウエスト準州',
            code: 'NT',
          },
          {
            name: 'ノバスコシア州',
            code: 'NS',
          },
          {
            name: 'ヌナブト準州',
            code: 'NU',
          },
          {
            name: 'オンタリオ州',
            code: 'ON',
          },
          {
            name: 'プリンスエドワードアイランド州',
            code: 'PE',
          },
          {
            name: 'ケベック州',
            code: 'QC',
          },
          {
            name: 'サスカチュワン州',
            code: 'SK',
          },
          {
            name: 'ユーコン準州',
            code: 'YT',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'カメルーン',
        code: 'CM',
        phoneNumberPrefix: 237,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'カンボジア',
        code: 'KH',
        phoneNumberPrefix: 855,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'カーボベルデ',
        code: 'CV',
        phoneNumberPrefix: 238,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ガイアナ',
        code: 'GY',
        phoneNumberPrefix: 592,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ガボン',
        code: 'GA',
        phoneNumberPrefix: 241,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ガンビア',
        code: 'GM',
        phoneNumberPrefix: 220,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ガーナ',
        code: 'GH',
        phoneNumberPrefix: 233,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ガーンジー',
        code: 'GG',
        phoneNumberPrefix: 44,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'キプロス',
        code: 'CY',
        phoneNumberPrefix: 357,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'キュラソー',
        code: 'CW',
        phoneNumberPrefix: 599,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'キューバ',
        code: 'CU',
        phoneNumberPrefix: 53,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'キリバス',
        code: 'KI',
        phoneNumberPrefix: 686,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'キルギス',
        code: 'KG',
        phoneNumberPrefix: 996,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{zip}{city}_{address2}_{address1}_{company}_{firstName}{lastName}_{country}_{phone}',
          show:
            '{zip} {city}_{address2}_{address1}_{company}_{firstName} {lastName}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ギニア',
        code: 'GN',
        phoneNumberPrefix: 224,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ギニアビサウ',
        code: 'GW',
        phoneNumberPrefix: 245,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ギリシャ',
        code: 'GR',
        phoneNumberPrefix: 30,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'クウェート',
        code: 'KW',
        phoneNumberPrefix: 965,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'クック諸島',
        code: 'CK',
        phoneNumberPrefix: 682,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'クリスマス島',
        code: 'CX',
        phoneNumberPrefix: 61,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'クロアチア',
        code: 'HR',
        phoneNumberPrefix: 385,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'グアテマラ',
        code: 'GT',
        phoneNumberPrefix: 502,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アルタ・ベラパス県',
            code: 'AVE',
          },
          {
            name: 'バハ・ベラパス県',
            code: 'BVE',
          },
          {
            name: 'チマルテナンゴ県',
            code: 'CMT',
          },
          {
            name: 'チキムラ県',
            code: 'CQM',
          },
          {
            name: 'エル・プログレソ県',
            code: 'EPR',
          },
          {
            name: 'エスクィントラ県',
            code: 'ESC',
          },
          {
            name: 'グアテマラ県',
            code: 'GUA',
          },
          {
            name: 'ウェウェテナンゴ県',
            code: 'HUE',
          },
          {
            name: 'イサバル県',
            code: 'IZA',
          },
          {
            name: 'ハラパ県',
            code: 'JAL',
          },
          {
            name: 'フティアパ県',
            code: 'JUT',
          },
          {
            name: 'ペテン県',
            code: 'PET',
          },
          {
            name: 'ケツァルテナンゴ県',
            code: 'QUE',
          },
          {
            name: 'キチェ県',
            code: 'QUI',
          },
          {
            name: 'レタルレウ県',
            code: 'RET',
          },
          {
            name: 'サカテペケス県',
            code: 'SAC',
          },
          {
            name: 'サン・マルコス県',
            code: 'SMA',
          },
          {
            name: 'サンタ・ローサ県',
            code: 'SRO',
          },
          {
            name: 'ソロラ県',
            code: 'SOL',
          },
          {
            name: 'スチテペケス県',
            code: 'SUC',
          },
          {
            name: 'トトニカパン県',
            code: 'TOT',
          },
          {
            name: 'サカパ県',
            code: 'ZAC',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: 'グアドループ',
        code: 'GP',
        phoneNumberPrefix: 590,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'グリーンランド',
        code: 'GL',
        phoneNumberPrefix: 299,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'グレナダ',
        code: 'GD',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ケイマン諸島',
        code: 'KY',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ケニア',
        code: 'KE',
        phoneNumberPrefix: 254,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ココス(キーリング)諸島',
        code: 'CC',
        phoneNumberPrefix: 891,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'コスタリカ',
        code: 'CR',
        phoneNumberPrefix: 506,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'コソボ',
        code: 'XK',
        phoneNumberPrefix: 383,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'コモロ',
        code: 'KM',
        phoneNumberPrefix: 269,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'コロンビア',
        code: 'CO',
        phoneNumberPrefix: 57,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'ボゴタ',
            code: 'DC',
          },
          {
            name: 'アマソナス県',
            code: 'AMA',
          },
          {
            name: 'アンティオキア県',
            code: 'ANT',
          },
          {
            name: 'アラウカ県',
            code: 'ARA',
          },
          {
            name: 'アトランティコ県',
            code: 'ATL',
          },
          {
            name: 'ボリーバル県',
            code: 'BOL',
          },
          {
            name: 'ボヤカ県',
            code: 'BOY',
          },
          {
            name: 'カルダス県',
            code: 'CAL',
          },
          {
            name: 'カケタ県',
            code: 'CAQ',
          },
          {
            name: 'カサナレ県',
            code: 'CAS',
          },
          {
            name: 'カウカ県',
            code: 'CAU',
          },
          {
            name: 'セサール県',
            code: 'CES',
          },
          {
            name: 'チョコ県',
            code: 'CHO',
          },
          {
            name: 'Córdoba',
            code: 'COR',
          },
          {
            name: 'クンディナマルカ県',
            code: 'CUN',
          },
          {
            name: 'グアイニア県',
            code: 'GUA',
          },
          {
            name: 'グアビアーレ県',
            code: 'GUV',
          },
          {
            name: 'ウイラ県',
            code: 'HUI',
          },
          {
            name: 'ラ・グアヒーラ県',
            code: 'LAG',
          },
          {
            name: 'マグダレーナ県',
            code: 'MAG',
          },
          {
            name: 'メタ県',
            code: 'MET',
          },
          {
            name: 'ナリーニョ県',
            code: 'NAR',
          },
          {
            name: 'ノルテ・デ・サンタンデール県',
            code: 'NSA',
          },
          {
            name: 'プトゥマヨ県',
            code: 'PUT',
          },
          {
            name: 'キンディオ県',
            code: 'QUI',
          },
          {
            name: 'リサラルダ県',
            code: 'RIS',
          },
          {
            name: 'サン・アンドレス・イ・プロビデンシア県',
            code: 'SAP',
          },
          {
            name: 'サンタンデール県',
            code: 'SAN',
          },
          {
            name: 'スクレ県',
            code: 'SUC',
          },
          {
            name: 'トリマ県',
            code: 'TOL',
          },
          {
            name: 'バジェ・デル・カウカ県',
            code: 'VAC',
          },
          {
            name: 'バウペス県',
            code: 'VAU',
          },
          {
            name: 'ビチャーダ県',
            code: 'VID',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'コンゴ共和国(ブラザビル)',
        code: 'CG',
        phoneNumberPrefix: 243,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'コンゴ民主共和国(キンシャサ)',
        code: 'CD',
        phoneNumberPrefix: 243,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'コートジボワール',
        code: 'CI',
        phoneNumberPrefix: 225,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サウジアラビア',
        code: 'SA',
        phoneNumberPrefix: 966,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サウスジョージア・サウスサンドウィッチ諸島',
        code: 'GS',
        phoneNumberPrefix: 500,
        autocompletionField: 'address1',
        continent: 'Other',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サモア',
        code: 'WS',
        phoneNumberPrefix: 685,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サントメ・プリンシペ',
        code: 'ST',
        phoneNumberPrefix: 239,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サンピエール島・ミクロン島',
        code: 'PM',
        phoneNumberPrefix: 508,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サンマリノ',
        code: 'SM',
        phoneNumberPrefix: 378,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サン・バルテルミー',
        code: 'BL',
        phoneNumberPrefix: 590,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'サン・マルタン',
        code: 'MF',
        phoneNumberPrefix: 590,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ザンビア',
        code: 'ZM',
        phoneNumberPrefix: 260,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'シエラレオネ',
        code: 'SL',
        phoneNumberPrefix: 232,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'シリア',
        code: 'SY',
        phoneNumberPrefix: 963,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'シンガポール',
        code: 'SG',
        phoneNumberPrefix: 65,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'シント・マールテン',
        code: 'SX',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ジブチ',
        code: 'DJ',
        phoneNumberPrefix: 253,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ジブラルタル',
        code: 'GI',
        phoneNumberPrefix: 350,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ジャマイカ',
        code: 'JM',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ジャージー',
        code: 'JE',
        phoneNumberPrefix: 44,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ジョージア',
        code: 'GE',
        phoneNumberPrefix: 995,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ジンバブエ',
        code: 'ZW',
        phoneNumberPrefix: 263,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スイス',
        code: 'CH',
        phoneNumberPrefix: 41,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '住所2',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '住所2 (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スウェーデン',
        code: 'SE',
        phoneNumberPrefix: 46,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市/町',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スバールバル諸島・ヤンマイエン島',
        code: 'SJ',
        phoneNumberPrefix: 47,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スペイン',
        code: 'ES',
        phoneNumberPrefix: 34,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}{province}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'ア・コルーニャ県',
            code: 'C',
          },
          {
            name: 'アラバ県',
            code: 'VI',
          },
          {
            name: 'アルバセテ県',
            code: 'AB',
          },
          {
            name: 'アリカンテ県',
            code: 'A',
          },
          {
            name: 'アルメリア県',
            code: 'AL',
          },
          {
            name: 'Asturias Province',
            code: 'O',
          },
          {
            name: 'アビラ県',
            code: 'AV',
          },
          {
            name: 'バダホス県',
            code: 'BA',
          },
          {
            name: 'バレアレス諸島²',
            code: 'PM',
          },
          {
            name: 'バルセロナ県',
            code: 'B',
          },
          {
            name: 'ブルゴス県',
            code: 'BU',
          },
          {
            name: 'カセレス県',
            code: 'CC',
          },
          {
            name: 'カディス県',
            code: 'CA',
          },
          {
            name: 'カンタブリア州²',
            code: 'S',
          },
          {
            name: 'カステリョン県',
            code: 'CS',
          },
          {
            name: 'セウタ',
            code: 'CE',
          },
          {
            name: 'シウダ・レアル県',
            code: 'CR',
          },
          {
            name: 'コルドバ県',
            code: 'CO',
          },
          {
            name: 'クエンカ県',
            code: 'CU',
          },
          {
            name: 'ジローナ県',
            code: 'GI',
          },
          {
            name: 'グラナダ県',
            code: 'GR',
          },
          {
            name: 'グアダラハラ県',
            code: 'GU',
          },
          {
            name: 'ギプスコア県',
            code: 'SS',
          },
          {
            name: 'ウエルバ県',
            code: 'H',
          },
          {
            name: 'ウエスカ県',
            code: 'HU',
          },
          {
            name: 'ハエン県',
            code: 'J',
          },
          {
            name: 'ラ・リオハ州',
            code: 'LO',
          },
          {
            name: 'ラス・パルマス県',
            code: 'GC',
          },
          {
            name: 'レオン県',
            code: 'LE',
          },
          {
            name: 'リェイダ県',
            code: 'L',
          },
          {
            name: 'ルーゴ県',
            code: 'LU',
          },
          {
            name: 'マドリード県',
            code: 'M',
          },
          {
            name: 'マラガ県',
            code: 'MA',
          },
          {
            name: 'メリリャ',
            code: 'ML',
          },
          {
            name: 'ムルシア県',
            code: 'MU',
          },
          {
            name: 'ナバラ州²',
            code: 'NA',
          },
          {
            name: 'オウレンセ県',
            code: 'OR',
          },
          {
            name: 'パレンシア県',
            code: 'P',
          },
          {
            name: 'ポンテベドラ県',
            code: 'PO',
          },
          {
            name: 'サラマンカ県',
            code: 'SA',
          },
          {
            name: 'サンタ・クルス・デ・テネリフェ県',
            code: 'TF',
          },
          {
            name: 'セゴビア県',
            code: 'SG',
          },
          {
            name: 'セビリア県',
            code: 'SE',
          },
          {
            name: 'ソリア県',
            code: 'SO',
          },
          {
            name: 'タラゴナ県',
            code: 'T',
          },
          {
            name: 'テルエル県',
            code: 'TE',
          },
          {
            name: 'トレド県',
            code: 'TO',
          },
          {
            name: 'バレンシア県',
            code: 'V',
          },
          {
            name: 'バリャドリッド県',
            code: 'VA',
          },
          {
            name: 'ビスカヤ県',
            code: 'BI',
          },
          {
            name: 'サモラ県',
            code: 'ZA',
          },
          {
            name: 'サラゴサ県',
            code: 'Z',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'スリナム',
        code: 'SR',
        phoneNumberPrefix: 597,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スリランカ',
        code: 'LK',
        phoneNumberPrefix: 94,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スロバキア',
        code: 'SK',
        phoneNumberPrefix: 421,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スロベニア',
        code: 'SI',
        phoneNumberPrefix: 386,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'スーダン',
        code: 'SD',
        phoneNumberPrefix: 249,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セネガル',
        code: 'SN',
        phoneNumberPrefix: 221,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セルビア',
        code: 'RS',
        phoneNumberPrefix: 381,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セントクリストファー・ネーヴィス',
        code: 'KN',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セントビンセント及びグレナディーン諸島',
        code: 'VC',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セントヘレナ',
        code: 'SH',
        phoneNumberPrefix: 290,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セントルシア',
        code: 'LC',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'セーシェル',
        code: 'SC',
        phoneNumberPrefix: 248,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ソマリア',
        code: 'SO',
        phoneNumberPrefix: 252,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ソロモン諸島',
        code: 'SB',
        phoneNumberPrefix: 677,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'タイ',
        code: 'TH',
        phoneNumberPrefix: 66,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アムナートチャルーン県',
            code: 'TH-37',
          },
          {
            name: 'アーントーン県',
            code: 'TH-15',
          },
          {
            name: 'バンコク',
            code: 'TH-10',
          },
          {
            name: 'ブンカーン県',
            code: 'TH-38',
          },
          {
            name: 'ブリーラム県',
            code: 'TH-31',
          },
          {
            name: 'チャチューンサオ県',
            code: 'TH-24',
          },
          {
            name: 'チャイナート県',
            code: 'TH-18',
          },
          {
            name: 'チャイヤプーム県',
            code: 'TH-36',
          },
          {
            name: 'チャンタブリー県',
            code: 'TH-22',
          },
          {
            name: 'チエンマイ県',
            code: 'TH-50',
          },
          {
            name: 'チエンラーイ県',
            code: 'TH-57',
          },
          {
            name: 'チョンブリー県',
            code: 'TH-20',
          },
          {
            name: 'チュムポーン県',
            code: 'TH-86',
          },
          {
            name: 'カーラシン県',
            code: 'TH-46',
          },
          {
            name: 'カムペーンペット県',
            code: 'TH-62',
          },
          {
            name: 'カーンチャナブリー県',
            code: 'TH-71',
          },
          {
            name: 'コーンケン県',
            code: 'TH-40',
          },
          {
            name: 'クラビー県',
            code: 'TH-81',
          },
          {
            name: 'ラムパーン県',
            code: 'TH-52',
          },
          {
            name: 'ラムプーン県',
            code: 'TH-51',
          },
          {
            name: 'ルーイ県',
            code: 'TH-42',
          },
          {
            name: 'ロッブリー県',
            code: 'TH-16',
          },
          {
            name: 'メーホンソーン県',
            code: 'TH-58',
          },
          {
            name: 'マハーサーラカーム県',
            code: 'TH-44',
          },
          {
            name: 'ムックダーハーン県',
            code: 'TH-49',
          },
          {
            name: 'ナコーンナーヨック県',
            code: 'TH-26',
          },
          {
            name: 'ナコーンパトム県',
            code: 'TH-73',
          },
          {
            name: 'ナコーンパノム県',
            code: 'TH-48',
          },
          {
            name: 'ナコーンラーチャシーマー県',
            code: 'TH-30',
          },
          {
            name: 'ナコーンサワン県',
            code: 'TH-60',
          },
          {
            name: 'ナコーンシータンマラート県',
            code: 'TH-80',
          },
          {
            name: 'ナーン県',
            code: 'TH-55',
          },
          {
            name: 'ナラーティワート県',
            code: 'TH-96',
          },
          {
            name: 'ノーンブワラムプー県',
            code: 'TH-39',
          },
          {
            name: 'ノーンカーイ県',
            code: 'TH-43',
          },
          {
            name: 'ノンタブリー県',
            code: 'TH-12',
          },
          {
            name: 'パトゥムターニー県',
            code: 'TH-13',
          },
          {
            name: 'パッターニー県',
            code: 'TH-94',
          },
          {
            name: 'パッタヤー',
            code: 'TH-S',
          },
          {
            name: 'パンガー県',
            code: 'TH-82',
          },
          {
            name: 'パッタルン県',
            code: 'TH-93',
          },
          {
            name: 'パヤオ県',
            code: 'TH-56',
          },
          {
            name: 'ペッチャブーン県',
            code: 'TH-67',
          },
          {
            name: 'ペッチャブリー県',
            code: 'TH-76',
          },
          {
            name: 'ピチット県',
            code: 'TH-66',
          },
          {
            name: 'ピッサヌローク県',
            code: 'TH-65',
          },
          {
            name: 'アユタヤ県',
            code: 'TH-14',
          },
          {
            name: 'プレー県',
            code: 'TH-54',
          },
          {
            name: 'プーケット県',
            code: 'TH-83',
          },
          {
            name: 'プラーチーンブリー県',
            code: 'TH-25',
          },
          {
            name: 'プラチュワップキーリーカン県',
            code: 'TH-77',
          },
          {
            name: 'ラノーン県',
            code: 'TH-85',
          },
          {
            name: 'ラーチャブリー県',
            code: 'TH-70',
          },
          {
            name: 'ラヨーン県',
            code: 'TH-21',
          },
          {
            name: 'ローイエット県',
            code: 'TH-45',
          },
          {
            name: 'サケーオ県',
            code: 'TH-27',
          },
          {
            name: 'サコンナコーン県',
            code: 'TH-47',
          },
          {
            name: 'サムットプラーカーン県',
            code: 'TH-11',
          },
          {
            name: 'サムットサーコーン県',
            code: 'TH-74',
          },
          {
            name: 'サムットソンクラーム県',
            code: 'TH-75',
          },
          {
            name: 'サラブリー県',
            code: 'TH-19',
          },
          {
            name: 'サトゥーン県',
            code: 'TH-91',
          },
          {
            name: 'シンブリー県',
            code: 'TH-17',
          },
          {
            name: 'シーサケート県',
            code: 'TH-33',
          },
          {
            name: 'ソンクラー県',
            code: 'TH-90',
          },
          {
            name: 'スコータイ県',
            code: 'TH-64',
          },
          {
            name: 'スパンブリー県',
            code: 'TH-72',
          },
          {
            name: 'スラートターニー県',
            code: 'TH-84',
          },
          {
            name: 'スリン県',
            code: 'TH-32',
          },
          {
            name: 'ターク県',
            code: 'TH-63',
          },
          {
            name: 'トラン県',
            code: 'TH-92',
          },
          {
            name: 'トラート県',
            code: 'TH-23',
          },
          {
            name: 'ウボンラーチャターニー県',
            code: 'TH-34',
          },
          {
            name: 'ウドーンターニー県',
            code: 'TH-41',
          },
          {
            name: 'ウタイターニー県',
            code: 'TH-61',
          },
          {
            name: 'ウッタラディット県',
            code: 'TH-53',
          },
          {
            name: 'ヤラー県',
            code: 'TH-95',
          },
          {
            name: 'ヤソートーン県',
            code: 'TH-35',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'タジキスタン',
        code: 'TJ',
        phoneNumberPrefix: 992,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'タンザニア',
        code: 'TZ',
        phoneNumberPrefix: 255,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'タークス・カイコス諸島',
        code: 'TC',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'チェコ',
        code: 'CZ',
        phoneNumberPrefix: 420,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'チャド',
        code: 'TD',
        phoneNumberPrefix: 235,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'チュニジア',
        code: 'TN',
        phoneNumberPrefix: 216,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'チリ',
        code: 'CL',
        phoneNumberPrefix: 56,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{province}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アリカ・イ・パリナコータ州',
            code: 'AP',
          },
          {
            name: 'タラパカ州',
            code: 'TA',
          },
          {
            name: 'アントファガスタ州',
            code: 'AN',
          },
          {
            name: 'アタカマ州',
            code: 'AT',
          },
          {
            name: 'コキンボ州',
            code: 'CO',
          },
          {
            name: 'バルパライソ州',
            code: 'VS',
          },
          {
            name: '首都州',
            code: 'RM',
          },
          {
            name: 'リベルタドール・ベルナルド・オイギンス州',
            code: 'LI',
          },
          {
            name: 'マウレ州',
            code: 'ML',
          },
          {
            name: 'ニュブレ州',
            code: 'NB',
          },
          {
            name: 'ビオビオ州',
            code: 'BI',
          },
          {
            name: 'ラ・アラウカニア州',
            code: 'AR',
          },
          {
            name: 'ロス・リオス州',
            code: 'LR',
          },
          {
            name: 'ロス・ラゴス州',
            code: 'LL',
          },
          {
            name:
              'アイセン・デル・ヘネラル・カルロス・イバニェス・デル・カンポ州',
            code: 'AI',
          },
          {
            name: 'マガジャネス・イ・デ・ラ・アンタルティカ・チレーナ州',
            code: 'MA',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: 'ツバル',
        code: 'TV',
        phoneNumberPrefix: 688,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'デンマーク',
        code: 'DK',
        phoneNumberPrefix: 45,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'トケラウ',
        code: 'TK',
        phoneNumberPrefix: 690,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'トリニダード・トバゴ',
        code: 'TT',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'トルクメニスタン',
        code: 'TM',
        phoneNumberPrefix: 993,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{zip}{city}_{country}_{firstName}{lastName}_{company}_{address1}_{address2}_{phone}',
          show:
            '{zip}{city}_{country}_{firstName}{lastName}_{company}_{address1}_{address2}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'トルコ',
        code: 'TR',
        phoneNumberPrefix: 90,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'トンガ',
        code: 'TO',
        phoneNumberPrefix: 676,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'トーゴ',
        code: 'TG',
        phoneNumberPrefix: 228,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ドイツ',
        code: 'DE',
        phoneNumberPrefix: 49,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ドミニカ共和国',
        code: 'DO',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ドミニカ国',
        code: 'DM',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ナイジェリア',
        code: 'NG',
        phoneNumberPrefix: 234,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アビア州',
            code: 'AB',
          },
          {
            name: '連邦首都地区',
            code: 'FC',
          },
          {
            name: 'アダマワ州',
            code: 'AD',
          },
          {
            name: 'アクワ・イボム州',
            code: 'AK',
          },
          {
            name: 'アナンブラ州',
            code: 'AN',
          },
          {
            name: 'バウチ州',
            code: 'BA',
          },
          {
            name: 'バイエルサ州',
            code: 'BY',
          },
          {
            name: 'ベヌエ州',
            code: 'BE',
          },
          {
            name: 'ボルノ州',
            code: 'BO',
          },
          {
            name: 'クロスリバー州',
            code: 'CR',
          },
          {
            name: 'デルタ州',
            code: 'DE',
          },
          {
            name: 'エボニ州',
            code: 'EB',
          },
          {
            name: 'エド州',
            code: 'ED',
          },
          {
            name: 'エキティ州',
            code: 'EK',
          },
          {
            name: 'エヌグ州',
            code: 'EN',
          },
          {
            name: 'ゴンベ州',
            code: 'GO',
          },
          {
            name: 'イモ州',
            code: 'IM',
          },
          {
            name: 'ジガワ州',
            code: 'JI',
          },
          {
            name: 'カドゥナ州',
            code: 'KD',
          },
          {
            name: 'カノ州',
            code: 'KN',
          },
          {
            name: 'カツィナ州',
            code: 'KT',
          },
          {
            name: 'ケビ州',
            code: 'KE',
          },
          {
            name: 'コギ州',
            code: 'KO',
          },
          {
            name: 'クワラ州',
            code: 'KW',
          },
          {
            name: 'レゴス州',
            code: 'LA',
          },
          {
            name: 'ナサラワ州',
            code: 'NA',
          },
          {
            name: 'ナイジャ州',
            code: 'NI',
          },
          {
            name: 'オグン州',
            code: 'OG',
          },
          {
            name: 'オンド州',
            code: 'ON',
          },
          {
            name: 'オスン州',
            code: 'OS',
          },
          {
            name: 'オヨ州',
            code: 'OY',
          },
          {
            name: 'プラトー州',
            code: 'PL',
          },
          {
            name: 'リバーズ州',
            code: 'RI',
          },
          {
            name: 'ソコト州',
            code: 'SO',
          },
          {
            name: 'タラバ州',
            code: 'TA',
          },
          {
            name: 'ヨベ州',
            code: 'YO',
          },
          {
            name: 'ザムファラ州',
            code: 'ZA',
          },
        ],
        provinceKey: 'STATE',
      },
      {
        name: 'ナウル',
        code: 'NR',
        phoneNumberPrefix: 674,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ナミビア',
        code: 'NA',
        phoneNumberPrefix: 264,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ニウエ',
        code: 'NU',
        phoneNumberPrefix: 683,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ニカラグア',
        code: 'NI',
        phoneNumberPrefix: 505,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ニジェール',
        code: 'NE',
        phoneNumberPrefix: 227,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ニューカレドニア',
        code: 'NC',
        phoneNumberPrefix: 687,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ニュージーランド',
        code: 'NZ',
        phoneNumberPrefix: 64,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{province}_{city} {zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'オークランド地方',
            code: 'AUK',
          },
          {
            name: 'ベイ・オブ・プレンティ地方',
            code: 'BOP',
          },
          {
            name: 'カンタベリー地方',
            code: 'CAN',
          },
          {
            name: 'ギズボーン地方',
            code: 'GIS',
          },
          {
            name: 'ホークス・ベイ地方',
            code: 'HKB',
          },
          {
            name: 'マナワツ・ワンガヌイ地方',
            code: 'MWT',
          },
          {
            name: 'マールボロ地方',
            code: 'MBH',
          },
          {
            name: 'ネルソン地方',
            code: 'NSN',
          },
          {
            name: 'ノースランド地方',
            code: 'NTL',
          },
          {
            name: 'オタゴ地方',
            code: 'OTA',
          },
          {
            name: 'サウスランド地方',
            code: 'STL',
          },
          {
            name: 'タラナキ地方',
            code: 'TKI',
          },
          {
            name: 'タスマン地方',
            code: 'TAS',
          },
          {
            name: 'ワイカト地方',
            code: 'WKO',
          },
          {
            name: 'ウェリントン地方',
            code: 'WGN',
          },
          {
            name: 'ウェスト・コースト地方',
            code: 'WTC',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: 'ネパール',
        code: 'NP',
        phoneNumberPrefix: 977,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ノルウェー',
        code: 'NO',
        phoneNumberPrefix: 47,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ノーフォーク島',
        code: 'NF',
        phoneNumberPrefix: 672,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ハイチ',
        code: 'HT',
        phoneNumberPrefix: 509,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ハンガリー',
        code: 'HU',
        phoneNumberPrefix: 36,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ハード島・マクドナルド諸島',
        code: 'HM',
        phoneNumberPrefix: 0,
        autocompletionField: 'address1',
        continent: 'Other',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バチカン市国',
        code: 'VA',
        phoneNumberPrefix: 379,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バヌアツ',
        code: 'VU',
        phoneNumberPrefix: 678,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バハマ',
        code: 'BS',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バミューダ',
        code: 'BM',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バルバドス',
        code: 'BB',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バングラデシュ',
        code: 'BD',
        phoneNumberPrefix: 880,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'バーレーン',
        code: 'BH',
        phoneNumberPrefix: 973,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'パキスタン',
        code: 'PK',
        phoneNumberPrefix: 92,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'パナマ',
        code: 'PA',
        phoneNumberPrefix: 507,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'ボカス・デル・トーロ県',
            code: 'PA-1',
          },
          {
            name: 'チリキ県',
            code: 'PA-4',
          },
          {
            name: 'コクレ県',
            code: 'PA-2',
          },
          {
            name: 'コロン県',
            code: 'PA-3',
          },
          {
            name: 'ダリエン県',
            code: 'PA-5',
          },
          {
            name: 'エンベラ自治区',
            code: 'PA-EM',
          },
          {
            name: 'エレーラ県',
            code: 'PA-6',
          },
          {
            name: 'クナ・ヤラ自治区',
            code: 'PA-KY',
          },
          {
            name: 'ロス・サントス県',
            code: 'PA-7',
          },
          {
            name: 'ノベ・ブグレ自治区',
            code: 'PA-NB',
          },
          {
            name: 'パナマ県',
            code: 'PA-8',
          },
          {
            name: '西パナマ県',
            code: 'PA-10',
          },
          {
            name: 'ベラグアス県',
            code: 'PA-9',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: 'パプアニューギニア',
        code: 'PG',
        phoneNumberPrefix: 675,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'パラグアイ',
        code: 'PY',
        phoneNumberPrefix: 595,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'パレスチナ自治区',
        code: 'PS',
        phoneNumberPrefix: 970,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ピトケアン諸島',
        code: 'PN',
        phoneNumberPrefix: 64,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'フィジー',
        code: 'FJ',
        phoneNumberPrefix: 679,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'フィリピン',
        code: 'PH',
        phoneNumberPrefix: 63,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'フィンランド',
        code: 'FI',
        phoneNumberPrefix: 358,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'フェロー諸島',
        code: 'FO',
        phoneNumberPrefix: 298,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'フォークランド諸島',
        code: 'FK',
        phoneNumberPrefix: 500,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'フランス',
        code: 'FR',
        phoneNumberPrefix: 33,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ブラジル',
        code: 'BR',
        phoneNumberPrefix: 55,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アクレ州',
            code: 'AC',
          },
          {
            name: 'アラゴアス州',
            code: 'AL',
          },
          {
            name: 'アマパー州',
            code: 'AP',
          },
          {
            name: 'アマゾナス州',
            code: 'AM',
          },
          {
            name: 'バイーア州',
            code: 'BA',
          },
          {
            name: 'セアラー州',
            code: 'CE',
          },
          {
            name: 'ブラジリア連邦直轄区',
            code: 'DF',
          },
          {
            name: 'エスピリトサント州',
            code: 'ES',
          },
          {
            name: 'ゴイアス州',
            code: 'GO',
          },
          {
            name: 'マラニョン州',
            code: 'MA',
          },
          {
            name: 'マットグロッソ州',
            code: 'MT',
          },
          {
            name: 'マットグロッソ・ド・スル州',
            code: 'MS',
          },
          {
            name: 'ミナスジェライス州',
            code: 'MG',
          },
          {
            name: 'パラー州',
            code: 'PA',
          },
          {
            name: 'パライバ州',
            code: 'PB',
          },
          {
            name: 'パラナ州',
            code: 'PR',
          },
          {
            name: 'ペルナンブーコ州',
            code: 'PE',
          },
          {
            name: 'ピアウイ州',
            code: 'PI',
          },
          {
            name: 'リオグランデ・ド・ノルテ州',
            code: 'RN',
          },
          {
            name: 'リオグランデ・ド・スル州',
            code: 'RS',
          },
          {
            name: 'リオデジャネイロ州',
            code: 'RJ',
          },
          {
            name: 'ロンドニア州',
            code: 'RO',
          },
          {
            name: 'ロライマ州',
            code: 'RR',
          },
          {
            name: 'サンタカタリーナ州',
            code: 'SC',
          },
          {
            name: 'サンパウロ州',
            code: 'SP',
          },
          {
            name: 'セルジッペ州',
            code: 'SE',
          },
          {
            name: 'トカンティンス州',
            code: 'TO',
          },
        ],
        provinceKey: 'STATE',
      },
      {
        name: 'ブルガリア',
        code: 'BG',
        phoneNumberPrefix: 359,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ブルキナファソ',
        code: 'BF',
        phoneNumberPrefix: 226,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ブルネイ',
        code: 'BN',
        phoneNumberPrefix: 673,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ブルンジ',
        code: 'BI',
        phoneNumberPrefix: 257,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ブータン',
        code: 'BT',
        phoneNumberPrefix: 975,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ブーベ島',
        code: 'BV',
        phoneNumberPrefix: 55,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ベトナム',
        code: 'VN',
        phoneNumberPrefix: 84,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ベナン',
        code: 'BJ',
        phoneNumberPrefix: 229,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ベネズエラ',
        code: 'VE',
        phoneNumberPrefix: 58,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ベラルーシ',
        code: 'BY',
        phoneNumberPrefix: 375,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ベリーズ',
        code: 'BZ',
        phoneNumberPrefix: 501,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ベルギー',
        code: 'BE',
        phoneNumberPrefix: 32,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ペルー',
        code: 'PE',
        phoneNumberPrefix: 51,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アマソナス県',
            code: 'PE-AMA',
          },
          {
            name: 'アンカシュ県',
            code: 'PE-ANC',
          },
          {
            name: 'アプリマク県',
            code: 'PE-APU',
          },
          {
            name: 'アレキパ県',
            code: 'PE-ARE',
          },
          {
            name: 'アヤクーチョ県',
            code: 'PE-AYA',
          },
          {
            name: 'カハマルカ県',
            code: 'PE-CAJ',
          },
          {
            name: 'カヤオ特別区',
            code: 'PE-CAL',
          },
          {
            name: 'クスコ県',
            code: 'PE-CUS',
          },
          {
            name: 'ワンカベリカ県',
            code: 'PE-HUV',
          },
          {
            name: 'ワヌコ県',
            code: 'PE-HUC',
          },
          {
            name: 'イカ県',
            code: 'PE-ICA',
          },
          {
            name: 'フニン県',
            code: 'PE-JUN',
          },
          {
            name: 'ラ・リベルタ県',
            code: 'PE-LAL',
          },
          {
            name: 'ランバイエケ県',
            code: 'PE-LAM',
          },
          {
            name: 'リマ県',
            code: 'PE-LIM',
          },
          {
            name: 'リマ郡',
            code: 'PE-LMA',
          },
          {
            name: 'ロレート県',
            code: 'PE-LOR',
          },
          {
            name: 'マードレ・デ・ディオス県',
            code: 'PE-MDD',
          },
          {
            name: 'モケグア県',
            code: 'PE-MOQ',
          },
          {
            name: 'パスコ県',
            code: 'PE-PAS',
          },
          {
            name: 'ピウラ県',
            code: 'PE-PIU',
          },
          {
            name: 'プーノ県',
            code: 'PE-PUN',
          },
          {
            name: 'サン・マルティン県',
            code: 'PE-SAM',
          },
          {
            name: 'タクナ県',
            code: 'PE-TAC',
          },
          {
            name: 'トゥンベス県',
            code: 'PE-TUM',
          },
          {
            name: 'ウカヤリ県',
            code: 'PE-UCA',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: 'ホンジュラス',
        code: 'HN',
        phoneNumberPrefix: 504,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ボスニア・ヘルツェゴビナ',
        code: 'BA',
        phoneNumberPrefix: 387,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ボツワナ',
        code: 'BW',
        phoneNumberPrefix: 267,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ボリビア',
        code: 'BO',
        phoneNumberPrefix: 591,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ポルトガル',
        code: 'PT',
        phoneNumberPrefix: 351,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アゾレス諸島',
            code: 'PT-20',
          },
          {
            name: 'アヴェイロ県',
            code: 'PT-01',
          },
          {
            name: 'ベージャ県',
            code: 'PT-02',
          },
          {
            name: 'ブラガ県',
            code: 'PT-03',
          },
          {
            name: 'ブラガンサ県',
            code: 'PT-04',
          },
          {
            name: 'カステロ・ブランコ県',
            code: 'PT-05',
          },
          {
            name: 'コインブラ県',
            code: 'PT-06',
          },
          {
            name: 'エヴォラ県',
            code: 'PT-07',
          },
          {
            name: 'ファーロ県',
            code: 'PT-08',
          },
          {
            name: 'グアルダ県',
            code: 'PT-09',
          },
          {
            name: 'レイリア県',
            code: 'PT-10',
          },
          {
            name: 'リスボン県',
            code: 'PT-11',
          },
          {
            name: 'マデイラ諸島',
            code: 'PT-30',
          },
          {
            name: 'ポルタレグレ県',
            code: 'PT-12',
          },
          {
            name: 'ポルト県',
            code: 'PT-13',
          },
          {
            name: 'サンタレン県',
            code: 'PT-14',
          },
          {
            name: 'セトゥーバル県',
            code: 'PT-15',
          },
          {
            name: 'ヴィアナ・ド・カステロ県',
            code: 'PT-16',
          },
          {
            name: 'ヴィラ・レアル県',
            code: 'PT-17',
          },
          {
            name: 'ヴィゼウ県',
            code: 'PT-18',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: 'ポーランド',
        code: 'PL',
        phoneNumberPrefix: 48,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マダガスカル',
        code: 'MG',
        phoneNumberPrefix: 261,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マヨット',
        code: 'YT',
        phoneNumberPrefix: 262,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マラウイ',
        code: 'MW',
        phoneNumberPrefix: 265,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マリ',
        code: 'ML',
        phoneNumberPrefix: 223,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マルタ',
        code: 'MT',
        phoneNumberPrefix: 356,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マルティニーク',
        code: 'MQ',
        phoneNumberPrefix: 596,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'マレーシア',
        code: 'MY',
        phoneNumberPrefix: 60,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '州/地区',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{province}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'ジョホール州',
            code: 'JHR',
          },
          {
            name: 'ケダ州',
            code: 'KDH',
          },
          {
            name: 'クランタン州',
            code: 'KTN',
          },
          {
            name: 'クアラルンプール',
            code: 'KUL',
          },
          {
            name: 'ラブアン',
            code: 'LBN',
          },
          {
            name: 'ムラカ州',
            code: 'MLK',
          },
          {
            name: 'ヌグリ・スンビラン州',
            code: 'NSN',
          },
          {
            name: 'パハン州',
            code: 'PHG',
          },
          {
            name: 'ペナン州',
            code: 'PNG',
          },
          {
            name: 'ペラ州',
            code: 'PRK',
          },
          {
            name: 'プルリス州',
            code: 'PLS',
          },
          {
            name: 'プトラジャヤ',
            code: 'PJY',
          },
          {
            name: 'サバ州',
            code: 'SBH',
          },
          {
            name: 'サラワク州',
            code: 'SWK',
          },
          {
            name: 'セランゴール州',
            code: 'SGR',
          },
          {
            name: 'トレンガヌ州',
            code: 'TRG',
          },
        ],
        provinceKey: 'STATE_AND_TERRITORY',
      },
      {
        name: 'マン島',
        code: 'IM',
        phoneNumberPrefix: 44,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ミャンマー (ビルマ)',
        code: 'MM',
        phoneNumberPrefix: 95,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'メキシコ',
        code: 'MX',
        phoneNumberPrefix: 52,
        autocompletionField: 'address1',
        continent: 'North America',
        labels: {
          address1: '住所および部屋番号',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{province}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アグアスカリエンテス州',
            code: 'AGS',
          },
          {
            name: 'バハ・カリフォルニア州',
            code: 'BC',
          },
          {
            name: 'バハ・カリフォルニア・スル州',
            code: 'BCS',
          },
          {
            name: 'カンペチェ州',
            code: 'CAMP',
          },
          {
            name: 'チアパス州',
            code: 'CHIS',
          },
          {
            name: 'チワワ州',
            code: 'CHIH',
          },
          {
            name: 'メキシコシティ',
            code: 'DF',
          },
          {
            name: 'コアウイラ州',
            code: 'COAH',
          },
          {
            name: 'コリマ州',
            code: 'COL',
          },
          {
            name: 'ドゥランゴ州',
            code: 'DGO',
          },
          {
            name: 'グアナフアト州',
            code: 'GTO',
          },
          {
            name: 'ゲレーロ州',
            code: 'GRO',
          },
          {
            name: 'イダルゴ州',
            code: 'HGO',
          },
          {
            name: 'ハリスコ州',
            code: 'JAL',
          },
          {
            name: 'メヒコ州',
            code: 'MEX',
          },
          {
            name: 'ミチョアカン州',
            code: 'MICH',
          },
          {
            name: 'モレロス州',
            code: 'MOR',
          },
          {
            name: 'ナヤリット州',
            code: 'NAY',
          },
          {
            name: 'ヌエボ・レオン州',
            code: 'NL',
          },
          {
            name: 'オアハカ州',
            code: 'OAX',
          },
          {
            name: 'プエブラ州',
            code: 'PUE',
          },
          {
            name: 'ケレタロ州',
            code: 'QRO',
          },
          {
            name: 'キンタナ・ロー州',
            code: 'Q ROO',
          },
          {
            name: 'サン・ルイス・ポトシ州',
            code: 'SLP',
          },
          {
            name: 'シナロア州',
            code: 'SIN',
          },
          {
            name: 'ソノラ州',
            code: 'SON',
          },
          {
            name: 'タバスコ州',
            code: 'TAB',
          },
          {
            name: 'タマウリパス州',
            code: 'TAMPS',
          },
          {
            name: 'トラスカラ州',
            code: 'TLAX',
          },
          {
            name: 'ベラクルス州',
            code: 'VER',
          },
          {
            name: 'ユカタン州',
            code: 'YUC',
          },
          {
            name: 'サカテカス州',
            code: 'ZAC',
          },
        ],
        provinceKey: 'STATE',
      },
      {
        name: 'モザンビーク',
        code: 'MZ',
        phoneNumberPrefix: 258,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モナコ',
        code: 'MC',
        phoneNumberPrefix: 377,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モルディブ',
        code: 'MV',
        phoneNumberPrefix: 960,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モルドバ',
        code: 'MD',
        phoneNumberPrefix: 373,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モロッコ',
        code: 'MA',
        phoneNumberPrefix: 212,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モンゴル',
        code: 'MN',
        phoneNumberPrefix: 976,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モンテネグロ',
        code: 'ME',
        phoneNumberPrefix: 382,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モントセラト',
        code: 'MS',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モーリシャス',
        code: 'MU',
        phoneNumberPrefix: 230,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'モーリタニア',
        code: 'MR',
        phoneNumberPrefix: 222,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ヨルダン',
        code: 'JO',
        phoneNumberPrefix: 962,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ラオス',
        code: 'LA',
        phoneNumberPrefix: 856,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'PROVINCE',
      },
      {
        name: 'ラトビア',
        code: 'LV',
        phoneNumberPrefix: 371,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'リトアニア',
        code: 'LT',
        phoneNumberPrefix: 370,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'リヒテンシュタイン',
        code: 'LI',
        phoneNumberPrefix: 423,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'リビア',
        code: 'LY',
        phoneNumberPrefix: 218,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'リベリア',
        code: 'LR',
        phoneNumberPrefix: 231,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ルクセンブルク',
        code: 'LU',
        phoneNumberPrefix: 352,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ルワンダ',
        code: 'RW',
        phoneNumberPrefix: 250,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ルーマニア',
        code: 'RO',
        phoneNumberPrefix: 40,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{province}{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アルバ県',
            code: 'AB',
          },
          {
            name: 'アラド県',
            code: 'AR',
          },
          {
            name: 'アルジェシュ県',
            code: 'AG',
          },
          {
            name: 'バカウ県',
            code: 'BC',
          },
          {
            name: 'ビホル県',
            code: 'BH',
          },
          {
            name: 'Bistriţa-Năsăud',
            code: 'BN',
          },
          {
            name: 'ボトシャニ県',
            code: 'BT',
          },
          {
            name: 'ブライラ県',
            code: 'BR',
          },
          {
            name: 'ブラショフ県',
            code: 'BV',
          },
          {
            name: 'ブカレスト',
            code: 'B',
          },
          {
            name: 'ブザウ県',
            code: 'BZ',
          },
          {
            name: 'Caraș-Severin',
            code: 'CS',
          },
          {
            name: 'クルジュ県',
            code: 'CJ',
          },
          {
            name: 'コンスタンツァ県',
            code: 'CT',
          },
          {
            name: 'コヴァスナ県',
            code: 'CV',
          },
          {
            name: 'カララシ県',
            code: 'CL',
          },
          {
            name: 'ドルジュ県',
            code: 'DJ',
          },
          {
            name: 'ドゥンボヴィツァ県',
            code: 'DB',
          },
          {
            name: 'ガラツィ県',
            code: 'GL',
          },
          {
            name: 'ジュルジュ県',
            code: 'GR',
          },
          {
            name: 'ゴルジュ県',
            code: 'GJ',
          },
          {
            name: 'ハルギタ県',
            code: 'HR',
          },
          {
            name: 'フネドアラ県',
            code: 'HD',
          },
          {
            name: 'ヤロミツァ県',
            code: 'IL',
          },
          {
            name: 'ヤシ県',
            code: 'IS',
          },
          {
            name: 'イルフォヴ県',
            code: 'IF',
          },
          {
            name: 'マラムレシュ県',
            code: 'MM',
          },
          {
            name: 'メヘディンチ県',
            code: 'MH',
          },
          {
            name: 'ムレシュ県',
            code: 'MS',
          },
          {
            name: 'ネアムツ県',
            code: 'NT',
          },
          {
            name: 'オルト県',
            code: 'OT',
          },
          {
            name: 'プラホヴァ県',
            code: 'PH',
          },
          {
            name: 'サラージュ県',
            code: 'SJ',
          },
          {
            name: 'サトゥ・マーレ県',
            code: 'SM',
          },
          {
            name: 'シビウ県',
            code: 'SB',
          },
          {
            name: 'スチャヴァ県',
            code: 'SV',
          },
          {
            name: 'テレオルマン県',
            code: 'TR',
          },
          {
            name: 'ティミシュ県',
            code: 'TM',
          },
          {
            name: 'トゥルチャ県',
            code: 'TL',
          },
          {
            name: 'ヴルチャ県',
            code: 'VL',
          },
          {
            name: 'ヴァスルイ県',
            code: 'VS',
          },
          {
            name: 'ヴランチャ県',
            code: 'VN',
          },
        ],
        provinceKey: 'COUNTY',
      },
      {
        name: 'レソト',
        code: 'LS',
        phoneNumberPrefix: 266,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'レバノン',
        code: 'LB',
        phoneNumberPrefix: 961,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'レユニオン',
        code: 'RE',
        phoneNumberPrefix: 262,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: 'ロシア',
        code: 'RU',
        phoneNumberPrefix: 7,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: 'アルタイ地方',
            code: 'ALT',
          },
          {
            name: 'アルタイ共和国',
            code: 'AL',
          },
          {
            name: 'アムール州',
            code: 'AMU',
          },
          {
            name: 'アルハンゲリスク州',
            code: 'ARK',
          },
          {
            name: 'アストラハン州',
            code: 'AST',
          },
          {
            name: 'ベルゴロド州',
            code: 'BEL',
          },
          {
            name: 'ブリャンスク州',
            code: 'BRY',
          },
          {
            name: 'チェチェン共和国',
            code: 'CE',
          },
          {
            name: 'チェリャビンスク州',
            code: 'CHE',
          },
          {
            name: 'チュクチ自治管区',
            code: 'CHU',
          },
          {
            name: 'チュヴァシ共和国',
            code: 'CU',
          },
          {
            name: 'イルクーツク州',
            code: 'IRK',
          },
          {
            name: 'イヴァノヴォ州',
            code: 'IVA',
          },
          {
            name: 'ユダヤ自治州',
            code: 'YEV',
          },
          {
            name: 'カバルダ・バルカル共和国',
            code: 'KB',
          },
          {
            name: 'カリーニングラード州',
            code: 'KGD',
          },
          {
            name: 'カルーガ州',
            code: 'KLU',
          },
          {
            name: 'カムチャツカ地方',
            code: 'KAM',
          },
          {
            name: 'カラチャイ・チェルケス共和国',
            code: 'KC',
          },
          {
            name: 'ケメロヴォ州',
            code: 'KEM',
          },
          {
            name: 'ハバロフスク地方',
            code: 'KHA',
          },
          {
            name: 'ハンティ・マンシ自治管区・ユグラ',
            code: 'KHM',
          },
          {
            name: 'キーロフ州',
            code: 'KIR',
          },
          {
            name: 'コミ共和国',
            code: 'KO',
          },
          {
            name: 'コストロマ州',
            code: 'KOS',
          },
          {
            name: 'クラスノダール地方',
            code: 'KDA',
          },
          {
            name: 'クラスノヤルスク地方',
            code: 'KYA',
          },
          {
            name: 'クルガン州',
            code: 'KGN',
          },
          {
            name: 'クルスク州',
            code: 'KRS',
          },
          {
            name: 'レニングラード州',
            code: 'LEN',
          },
          {
            name: 'リペツク州',
            code: 'LIP',
          },
          {
            name: 'マガダン州',
            code: 'MAG',
          },
          {
            name: 'マリ・エル共和国',
            code: 'ME',
          },
          {
            name: 'モスクワ',
            code: 'MOW',
          },
          {
            name: 'モスクワ州',
            code: 'MOS',
          },
          {
            name: 'ムルマンスク州',
            code: 'MUR',
          },
          {
            name: 'ニジニ・ノヴゴロド州',
            code: 'NIZ',
          },
          {
            name: 'ノヴゴロド州',
            code: 'NGR',
          },
          {
            name: 'ノヴォシビルスク州',
            code: 'NVS',
          },
          {
            name: 'オムスク州',
            code: 'OMS',
          },
          {
            name: 'オレンブルク州',
            code: 'ORE',
          },
          {
            name: 'オリョール州',
            code: 'ORL',
          },
          {
            name: 'ペンザ州',
            code: 'PNZ',
          },
          {
            name: 'ペルミ地方',
            code: 'PER',
          },
          {
            name: '沿海地方',
            code: 'PRI',
          },
          {
            name: 'プスコフ州',
            code: 'PSK',
          },
          {
            name: 'アディゲ共和国',
            code: 'AD',
          },
          {
            name: 'バシコルトスタン共和国',
            code: 'BA',
          },
          {
            name: 'ブリヤート共和国',
            code: 'BU',
          },
          {
            name: 'ダゲスタン共和国',
            code: 'DA',
          },
          {
            name: 'イングーシ共和国',
            code: 'IN',
          },
          {
            name: 'カルムイク共和国',
            code: 'KL',
          },
          {
            name: 'カレリア共和国',
            code: 'KR',
          },
          {
            name: 'ハカス共和国',
            code: 'KK',
          },
          {
            name: 'モルドヴィア共和国',
            code: 'MO',
          },
          {
            name: '北オセチア共和国',
            code: 'SE',
          },
          {
            name: 'タタールスタン共和国',
            code: 'TA',
          },
          {
            name: 'ロストフ州',
            code: 'ROS',
          },
          {
            name: 'リャザン州',
            code: 'RYA',
          },
          {
            name: 'サンクトペテルブルク',
            code: 'SPE',
          },
          {
            name: 'サハ共和国',
            code: 'SA',
          },
          {
            name: 'サハリン州',
            code: 'SAK',
          },
          {
            name: 'サマラ州',
            code: 'SAM',
          },
          {
            name: 'サラトフ州',
            code: 'SAR',
          },
          {
            name: 'スモレンスク州',
            code: 'SMO',
          },
          {
            name: 'スタヴロポリ地方',
            code: 'STA',
          },
          {
            name: 'スヴェルドロフスク州',
            code: 'SVE',
          },
          {
            name: 'タンボフ州',
            code: 'TAM',
          },
          {
            name: 'トムスク州',
            code: 'TOM',
          },
          {
            name: 'トゥーラ州',
            code: 'TUL',
          },
          {
            name: 'トヴェリ州',
            code: 'TVE',
          },
          {
            name: 'チュメニ州',
            code: 'TYU',
          },
          {
            name: 'トゥヴァ共和国',
            code: 'TY',
          },
          {
            name: 'ウドムルト共和国',
            code: 'UD',
          },
          {
            name: 'ウリヤノフスク州',
            code: 'ULY',
          },
          {
            name: 'ヴラジーミル州',
            code: 'VLA',
          },
          {
            name: 'ヴォルゴグラード州',
            code: 'VGG',
          },
          {
            name: 'ヴォログダ州',
            code: 'VLG',
          },
          {
            name: 'ヴォロネジ州',
            code: 'VOR',
          },
          {
            name: 'ヤマロ・ネネツ自治管区',
            code: 'YAN',
          },
          {
            name: 'ヤロスラヴリ州',
            code: 'YAR',
          },
          {
            name: 'ザバイカリエ地方',
            code: 'ZAB',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: '中国',
        code: 'CN',
        phoneNumberPrefix: 86,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '省',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1} {address2} {city}_{zip} {province}_{country}_{phone}',
        },
        zones: [
          {
            name: '安徽省',
            code: 'AH',
          },
          {
            name: '北京市',
            code: 'BJ',
          },
          {
            name: '重慶市',
            code: 'CQ',
          },
          {
            name: '福建省',
            code: 'FJ',
          },
          {
            name: '甘粛省',
            code: 'GS',
          },
          {
            name: '広東省',
            code: 'GD',
          },
          {
            name: '広西チワン族自治区',
            code: 'GX',
          },
          {
            name: '貴州省',
            code: 'GZ',
          },
          {
            name: '海南省',
            code: 'HI',
          },
          {
            name: '河北省',
            code: 'HE',
          },
          {
            name: '黒竜江省',
            code: 'HL',
          },
          {
            name: '河南省',
            code: 'HA',
          },
          {
            name: '湖北省',
            code: 'HB',
          },
          {
            name: '湖南省',
            code: 'HN',
          },
          {
            name: '内モンゴル自治区',
            code: 'NM',
          },
          {
            name: '江蘇省',
            code: 'JS',
          },
          {
            name: '江西省',
            code: 'JX',
          },
          {
            name: '吉林省',
            code: 'JL',
          },
          {
            name: '遼寧省',
            code: 'LN',
          },
          {
            name: '寧夏回族自治区',
            code: 'NX',
          },
          {
            name: '青海省',
            code: 'QH',
          },
          {
            name: '陝西省',
            code: 'SN',
          },
          {
            name: '山東省',
            code: 'SD',
          },
          {
            name: '上海市',
            code: 'SH',
          },
          {
            name: '山西省',
            code: 'SX',
          },
          {
            name: '四川省',
            code: 'SC',
          },
          {
            name: '天津市',
            code: 'TJ',
          },
          {
            name: '新疆ウイグル自治区',
            code: 'XJ',
          },
          {
            name: 'チベット自治区',
            code: 'YZ',
          },
          {
            name: '雲南省',
            code: 'YN',
          },
          {
            name: '浙江省',
            code: 'ZJ',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: '中央アフリカ共和国',
        code: 'CF',
        phoneNumberPrefix: 236,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '中華人民共和国マカオ特別行政区',
        code: 'MO',
        phoneNumberPrefix: 853,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '中華人民共和国香港特別行政区',
        code: 'HK',
        phoneNumberPrefix: 852,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '地区',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province} {country}_{phone}',
        },
        zones: [
          {
            name: '香港島',
            code: 'HK',
          },
          {
            name: '九龍',
            code: 'KL',
          },
          {
            name: '新しい地域',
            code: 'NT',
          },
        ],
        provinceKey: 'REGION',
      },
      {
        name: '仏領ギアナ',
        code: 'GF',
        phoneNumberPrefix: 594,
        autocompletionField: 'address1',
        continent: 'South America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '仏領ポリネシア',
        code: 'PF',
        phoneNumberPrefix: 689,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '仏領極南諸島',
        code: 'TF',
        phoneNumberPrefix: 262,
        autocompletionField: 'address1',
        continent: 'Other',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '北マケドニア',
        code: 'MK',
        phoneNumberPrefix: 389,
        autocompletionField: 'address1',
        continent: 'Europe',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{zip}{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '北朝鮮',
        code: 'KP',
        phoneNumberPrefix: 82,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '南アフリカ',
        code: 'ZA',
        phoneNumberPrefix: 27,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{province}_{zip}_{country}_{phone}',
        },
        zones: [
          {
            name: '東ケープ州',
            code: 'EC',
          },
          {
            name: 'フリーステイト州',
            code: 'FS',
          },
          {
            name: 'ハウテン州',
            code: 'GT',
          },
          {
            name: 'クワズール・ナタール州',
            code: 'NL',
          },
          {
            name: 'リンポポ州',
            code: 'LP',
          },
          {
            name: 'ムプマランガ州',
            code: 'MP',
          },
          {
            name: '北西州',
            code: 'NW',
          },
          {
            name: '北ケープ州',
            code: 'NC',
          },
          {
            name: '西ケープ州',
            code: 'WC',
          },
        ],
        provinceKey: 'PROVINCE',
      },
      {
        name: '南スーダン',
        code: 'SS',
        phoneNumberPrefix: 211,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '台湾',
        code: 'TW',
        phoneNumberPrefix: 886,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '合衆国領有小離島',
        code: 'UM',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
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
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city} {zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'STATE',
      },
      {
        name: '日本',
        code: 'JP',
        phoneNumberPrefix: 81,
        autocompletionField: 'zip',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '都道府県',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
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
        provinceKey: 'PREFECTURE',
      },
      {
        name: '東ティモール',
        code: 'TL',
        phoneNumberPrefix: 670,
        autocompletionField: 'address1',
        continent: 'Oceania',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '英領インド洋地域',
        code: 'IO',
        phoneNumberPrefix: 246,
        autocompletionField: 'address1',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '英領ヴァージン諸島',
        code: 'VG',
        phoneNumberPrefix: 1,
        autocompletionField: 'address1',
        continent: 'Central America',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{city}_{zip}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '西サハラ',
        code: 'EH',
        phoneNumberPrefix: 212,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '赤道ギニア',
        code: 'GQ',
        phoneNumberPrefix: 240,
        autocompletionField: 'address1',
        continent: 'Africa',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '地域',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{zip}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{country}_{phone}',
        },
        zones: [],
        provinceKey: 'REGION',
      },
      {
        name: '韓国',
        code: 'KR',
        phoneNumberPrefix: 82,
        autocompletionField: 'zip',
        continent: 'Asia',
        labels: {
          address1: '住所',
          address2: '建物名、部屋番号など',
          city: '市区町村',
          company: '会社',
          country: '国/地域',
          firstName: '名',
          lastName: '姓',
          phone: '電話番号',
          postalCode: '郵便番号',
          zone: '行政区',
        },
        optionalLabels: {
          address2: '建物名、部屋番号など (任意)',
        },
        formatting: {
          edit:
            '{company}_{lastName}{firstName}_{zip}_{country}_{province}{city}_{address1}_{address2}_{phone}',
          show:
            '{firstName} {lastName}_{company}_{address1}_{address2}_{zip} {city}_{province}_{country}_{phone}',
        },
        zones: [
          {
            name: '釜山広域市',
            code: 'KR-26',
          },
          {
            name: '忠清北道',
            code: 'KR-43',
          },
          {
            name: '忠清南道',
            code: 'KR-44',
          },
          {
            name: '大邱広域市',
            code: 'KR-27',
          },
          {
            name: '大田広域市',
            code: 'KR-30',
          },
          {
            name: '江原道 (南)',
            code: 'KR-42',
          },
          {
            name: '光州広域市',
            code: 'KR-29',
          },
          {
            name: '慶尚北道',
            code: 'KR-47',
          },
          {
            name: '京畿道',
            code: 'KR-41',
          },
          {
            name: '慶尚南道',
            code: 'KR-48',
          },
          {
            name: '仁川広域市',
            code: 'KR-28',
          },
          {
            name: '済州特別自治道',
            code: 'KR-49',
          },
          {
            name: '全羅北道',
            code: 'KR-45',
          },
          {
            name: '全羅南道',
            code: 'KR-46',
          },
          {
            name: '世宗特別自治市',
            code: 'KR-50',
          },
          {
            name: 'ソウル特別市',
            code: 'KR-11',
          },
          {
            name: '蔚山広域市',
            code: 'KR-31',
          },
        ],
        provinceKey: 'PROVINCE',
      },
    ],
  },
};
export default data;
