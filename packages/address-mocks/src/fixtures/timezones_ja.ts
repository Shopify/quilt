const data = {
  data: {
    timeZones: [
      {
        olsonName: 'Etc/GMT+12',
        description: '(GMT-12:00) 国際日付変更線の西側',
      },
      {
        olsonName: 'Pacific/Pago_Pago',
        description: '(GMT-11:00) アメリカ領サモア',
      },
      {
        olsonName: 'Pacific/Midway',
        description: '(GMT-11:00) ミッドウェー島',
      },
      {
        olsonName: 'Pacific/Honolulu',
        description: '(GMT-10:00) ハワイ',
      },
      {
        olsonName: 'America/Juneau',
        description: '(GMT-09:00) アラスカ',
      },
      {
        olsonName: 'America/Los_Angeles',
        description: '(GMT-08:00) 太平洋標準時 (アメリカとカナダ)',
      },
      {
        olsonName: 'America/Tijuana',
        description: '(GMT-08:00) ティフアナ',
      },
      {
        olsonName: 'America/Phoenix',
        description: '(GMT-07:00) アリゾナ',
      },
      {
        olsonName: 'America/Chihuahua',
        description: '(GMT-07:00) チワワ',
      },
      {
        olsonName: 'America/Mazatlan',
        description: '(GMT-07:00) マサトラン',
      },
      {
        olsonName: 'America/Denver',
        description: '(GMT-07:00) 山岳部標準時 (アメリカとカナダ)',
      },
      {
        olsonName: 'America/Guatemala',
        description: '(GMT-06:00) 中央アメリカ',
      },
      {
        olsonName: 'America/Chicago',
        description: '(GMT-06:00) 中部標準時 (アメリカとカナダ)',
      },
      {
        olsonName: 'America/Mexico_City',
        description: '(GMT-06:00) グアダラハラ、メキシコシティ',
      },
      {
        olsonName: 'America/Monterrey',
        description: '(GMT-06:00) モンテレイ',
      },
      {
        olsonName: 'America/Regina',
        description: '(GMT-06:00) サスカチュワン州',
      },
      {
        olsonName: 'America/Bogota',
        description: '(GMT-05:00) ボゴタ',
      },
      {
        olsonName: 'America/New_York',
        description: '(GMT-05:00) 東部標準時 (アメリカとカナダ)',
      },
      {
        olsonName: 'America/Indiana/Indianapolis',
        description: '(GMT-05:00) インディアナ州 (東)',
      },
      {
        olsonName: 'America/Lima',
        description: '(GMT-05:00) リマ、キト',
      },
      {
        olsonName: 'America/Halifax',
        description: '(GMT-04:00) 大西洋標準時 (カナダ)',
      },
      {
        olsonName: 'America/Caracas',
        description: '(GMT-04:00) カラカス',
      },
      {
        olsonName: 'America/Guyana',
        description: '(GMT-04:00) ジョージタウン',
      },
      {
        olsonName: 'America/La_Paz',
        description: '(GMT-04:00) ラパス',
      },
      {
        olsonName: 'America/Puerto_Rico',
        description: '(GMT-04:00) プエルトリコ',
      },
      {
        olsonName: 'America/Santiago',
        description: '(GMT-04:00) サンディエゴ',
      },
      {
        olsonName: 'America/St_Johns',
        description: '(GMT-03:30) ニューファンドランド島',
      },
      {
        olsonName: 'America/Sao_Paulo',
        description: '(GMT-03:00) ブラジリア',
      },
      {
        olsonName: 'America/Argentina/Buenos_Aires',
        description: '(GMT-03:00) ブエノスアイレス',
      },
      {
        olsonName: 'America/Godthab',
        description: '(GMT-03:00) グリーンランド',
      },
      {
        olsonName: 'America/Montevideo',
        description: '(GMT-03:00) モンテビデオ',
      },
      {
        olsonName: 'Atlantic/South_Georgia',
        description: '(GMT-02:00) アメリカ合衆国中部大西洋岸',
      },
      {
        olsonName: 'Atlantic/Azores',
        description: '(GMT-01:00) アゾレス諸島',
      },
      {
        olsonName: 'Atlantic/Cape_Verde',
        description: '(GMT-01:00) カーボベルデ諸島',
      },
      {
        olsonName: 'Africa/Casablanca',
        description: '(GMT+01:00) カサブランカ',
      },
      {
        olsonName: 'Europe/Dublin',
        description: '(GMT+00:00) ダブリン',
      },
      {
        olsonName: 'Europe/London',
        description: '(GMT+00:00) エディンバラ、ロンドン',
      },
      {
        olsonName: 'Europe/Lisbon',
        description: '(GMT+00:00) リスボン',
      },
      {
        olsonName: 'Africa/Monrovia',
        description: '(GMT+00:00) モンロビア',
      },
      {
        olsonName: 'Etc/UTC',
        description: '(GMT+00:00) UTC',
      },
      {
        olsonName: 'Europe/Amsterdam',
        description: '(GMT+01:00) アムステルダム',
      },
      {
        olsonName: 'Europe/Belgrade',
        description: '(GMT+01:00) ベオグラード',
      },
      {
        olsonName: 'Europe/Berlin',
        description: '(GMT+01:00) ベルリン',
      },
      {
        olsonName: 'Europe/Zurich',
        description: '(GMT+01:00) ベルン、チューリッヒ',
      },
      {
        olsonName: 'Europe/Bratislava',
        description: '(GMT+01:00) ブラチスラヴァ',
      },
      {
        olsonName: 'Europe/Brussels',
        description: '(GMT+01:00) ブリュッセル',
      },
      {
        olsonName: 'Europe/Budapest',
        description: '(GMT+01:00) ブダペスト',
      },
      {
        olsonName: 'Europe/Copenhagen',
        description: '(GMT+01:00) コペンハーゲン',
      },
      {
        olsonName: 'Europe/Ljubljana',
        description: '(GMT+01:00) リュブリャナ',
      },
      {
        olsonName: 'Europe/Madrid',
        description: '(GMT+01:00) マドリード',
      },
      {
        olsonName: 'Europe/Paris',
        description: '(GMT+01:00) パリ',
      },
      {
        olsonName: 'Europe/Prague',
        description: '(GMT+01:00) プラハ',
      },
      {
        olsonName: 'Europe/Rome',
        description: '(GMT+01:00) ローマ',
      },
      {
        olsonName: 'Europe/Sarajevo',
        description: '(GMT+01:00) サラエヴォ',
      },
      {
        olsonName: 'Europe/Skopje',
        description: '(GMT+01:00) スコピエ',
      },
      {
        olsonName: 'Europe/Stockholm',
        description: '(GMT+01:00) ストックホルム',
      },
      {
        olsonName: 'Europe/Vienna',
        description: '(GMT+01:00) ウィーン',
      },
      {
        olsonName: 'Europe/Warsaw',
        description: '(GMT+01:00) ワルシャワ',
      },
      {
        olsonName: 'Africa/Algiers',
        description: '(GMT+01:00) 西中央アフリカ',
      },
      {
        olsonName: 'Europe/Zagreb',
        description: '(GMT+01:00) ザグレブ',
      },
      {
        olsonName: 'Europe/Athens',
        description: '(GMT+02:00) アテネ',
      },
      {
        olsonName: 'Europe/Bucharest',
        description: '(GMT+02:00) ブカレスト',
      },
      {
        olsonName: 'Africa/Cairo',
        description: '(GMT+02:00) カイロ',
      },
      {
        olsonName: 'Africa/Harare',
        description: '(GMT+02:00) ハラレ',
      },
      {
        olsonName: 'Europe/Helsinki',
        description: '(GMT+02:00) ヘルシンキ',
      },
      {
        olsonName: 'Asia/Jerusalem',
        description: '(GMT+02:00) エルサレム',
      },
      {
        olsonName: 'Europe/Kaliningrad',
        description: '(GMT+02:00) カリーニングラード',
      },
      {
        olsonName: 'Europe/Kiev',
        description: '(GMT+02:00) キエフ',
      },
      {
        olsonName: 'Africa/Johannesburg',
        description: '(GMT+02:00) プレトリア',
      },
      {
        olsonName: 'Europe/Riga',
        description: '(GMT+02:00) リガ',
      },
      {
        olsonName: 'Europe/Sofia',
        description: '(GMT+02:00) ソフィア',
      },
      {
        olsonName: 'Europe/Tallinn',
        description: '(GMT+02:00) タリン',
      },
      {
        olsonName: 'Europe/Vilnius',
        description: '(GMT+02:00) ヴィリニュス',
      },
      {
        olsonName: 'Asia/Baghdad',
        description: '(GMT+03:00) バグダード',
      },
      {
        olsonName: 'Europe/Istanbul',
        description: '(GMT+03:00) イスタンブール',
      },
      {
        olsonName: 'Asia/Kuwait',
        description: '(GMT+03:00) クウェート',
      },
      {
        olsonName: 'Europe/Minsk',
        description: '(GMT+03:00) ミンスク',
      },
      {
        olsonName: 'Europe/Moscow',
        description: '(GMT+03:00) モスクワ、サンクトペテルブルク',
      },
      {
        olsonName: 'Africa/Nairobi',
        description: '(GMT+03:00) ナイロビ',
      },
      {
        olsonName: 'Asia/Riyadh',
        description: '(GMT+03:00) リヤド',
      },
      {
        olsonName: 'Europe/Volgograd',
        description: '(GMT+03:00) ヴォルゴグラード',
      },
      {
        olsonName: 'Asia/Tehran',
        description: '(GMT+03:30) テヘラン',
      },
      {
        olsonName: 'Asia/Muscat',
        description: '(GMT+04:00) アブダビ、マスカット',
      },
      {
        olsonName: 'Asia/Baku',
        description: '(GMT+04:00) バクー',
      },
      {
        olsonName: 'Europe/Samara',
        description: '(GMT+04:00) サマーラ',
      },
      {
        olsonName: 'Asia/Tbilisi',
        description: '(GMT+04:00) トビリシ',
      },
      {
        olsonName: 'Asia/Yerevan',
        description: '(GMT+04:00) エレバン',
      },
      {
        olsonName: 'Asia/Kabul',
        description: '(GMT+04:30) カーブル',
      },
      {
        olsonName: 'Asia/Yekaterinburg',
        description: '(GMT+05:00) エカテリンブルク',
      },
      {
        olsonName: 'Asia/Karachi',
        description: '(GMT+05:00) イスラマバード、カラチ',
      },
      {
        olsonName: 'Asia/Tashkent',
        description: '(GMT+05:00) タシュケント',
      },
      {
        olsonName: 'Asia/Kolkata',
        description: '(GMT+05:30) チェンナイ、コルカタ、ムンバイ、ニューデリー',
      },
      {
        olsonName: 'Asia/Colombo',
        description: '(GMT+05:30) スリジャヤワルダナプラコッテ',
      },
      {
        olsonName: 'Asia/Kathmandu',
        description: '(GMT+05:45) カトマンズ',
      },
      {
        olsonName: 'Asia/Almaty',
        description: '(GMT+06:00) アルマトイ',
      },
      {
        olsonName: 'Asia/Dhaka',
        description: '(GMT+06:00) アスタナ、ダッカ',
      },
      {
        olsonName: 'Asia/Urumqi',
        description: '(GMT+06:00) ウルムチ',
      },
      {
        olsonName: 'Asia/Rangoon',
        description: '(GMT+06:30) ヤンゴン',
      },
      {
        olsonName: 'Asia/Bangkok',
        description: '(GMT+07:00) バンコク、ハノイ',
      },
      {
        olsonName: 'Asia/Jakarta',
        description: '(GMT+07:00) ジャカルタ',
      },
      {
        olsonName: 'Asia/Krasnoyarsk',
        description: '(GMT+07:00) クラスノヤルスク',
      },
      {
        olsonName: 'Asia/Novosibirsk',
        description: '(GMT+07:00) ノヴォシビルスク',
      },
      {
        olsonName: 'Asia/Shanghai',
        description: '(GMT+08:00) 北京',
      },
      {
        olsonName: 'Asia/Chongqing',
        description: '(GMT+08:00) 重慶',
      },
      {
        olsonName: 'Asia/Hong_Kong',
        description: '(GMT+08:00) 香港',
      },
      {
        olsonName: 'Asia/Irkutsk',
        description: '(GMT+08:00) イルクーツク',
      },
      {
        olsonName: 'Asia/Kuala_Lumpur',
        description: '(GMT+08:00) クアラルンプール',
      },
      {
        olsonName: 'Australia/Perth',
        description: '(GMT+08:00) パース',
      },
      {
        olsonName: 'Asia/Singapore',
        description: '(GMT+08:00) シンガポール',
      },
      {
        olsonName: 'Asia/Taipei',
        description: '(GMT+08:00) 台北',
      },
      {
        olsonName: 'Asia/Ulaanbaatar',
        description: '(GMT+08:00) ウランバートル',
      },
      {
        olsonName: 'Asia/Tokyo',
        description: '(GMT+09:00) 大阪、札幌、東京',
      },
      {
        olsonName: 'Asia/Seoul',
        description: '(GMT+09:00) ソウル',
      },
      {
        olsonName: 'Asia/Yakutsk',
        description: '(GMT+09:00) ヤクーツク',
      },
      {
        olsonName: 'Australia/Adelaide',
        description: '(GMT+09:30) アデレード',
      },
      {
        olsonName: 'Australia/Darwin',
        description: '(GMT+09:30) ダーウィン',
      },
      {
        olsonName: 'Australia/Brisbane',
        description: '(GMT+10:00) ブリスベン',
      },
      {
        olsonName: 'Australia/Melbourne',
        description: '(GMT+10:00) キャンベラ、メルボルン',
      },
      {
        olsonName: 'Pacific/Guam',
        description: '(GMT+10:00) グアム',
      },
      {
        olsonName: 'Australia/Hobart',
        description: '(GMT+10:00) ホバート',
      },
      {
        olsonName: 'Pacific/Port_Moresby',
        description: '(GMT+10:00) ポートモレスビー',
      },
      {
        olsonName: 'Australia/Sydney',
        description: '(GMT+10:00) シドニー',
      },
      {
        olsonName: 'Asia/Vladivostok',
        description: '(GMT+10:00) ウラジオストク',
      },
      {
        olsonName: 'Asia/Magadan',
        description: '(GMT+11:00) マガダン',
      },
      {
        olsonName: 'Pacific/Noumea',
        description: '(GMT+11:00) ニューカレドニア',
      },
      {
        olsonName: 'Pacific/Guadalcanal',
        description: '(GMT+11:00) ソロモン諸島',
      },
      {
        olsonName: 'Asia/Srednekolymsk',
        description: '(GMT+11:00) スレドネコリムスク',
      },
      {
        olsonName: 'Pacific/Auckland',
        description: '(GMT+12:00) オークランド、ウェリントン',
      },
      {
        olsonName: 'Pacific/Fiji',
        description: '(GMT+12:00) フィジー',
      },
      {
        olsonName: 'Asia/Kamchatka',
        description: '(GMT+12:00) カムチャツカ',
      },
      {
        olsonName: 'Pacific/Majuro',
        description: '(GMT+12:00) マーシャル諸島',
      },
      {
        olsonName: 'Pacific/Chatham',
        description: '(GMT+12:45) チャタム諸島',
      },
      {
        olsonName: 'Pacific/Tongatapu',
        description: '(GMT+13:00) ヌクアロファ',
      },
      {
        olsonName: 'Pacific/Apia',
        description: '(GMT+13:00) サモア',
      },
      {
        olsonName: 'Pacific/Fakaofo',
        description: '(GMT+13:00) トケラウ諸島',
      },
    ],
  },
};
export default data;
