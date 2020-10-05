const fs = require('fs');
const countriesList = require('countries-list');
const intlTelInput = require('intl-tel-input/build/js/data');
const libphonenumberJS = require('libphonenumber-js');
const examples = require('libphonenumber-js/examples.mobile.json');
const usAreaCodes = require('us-area-codes/data/codes.json');

function obtainCountryInformation(telephoneData) {
  let countryInformation = [];
  telephoneData.forEach(countryObj => {
    if (countriesList.countries[countryObj['iso2'].toUpperCase()]) {
      let countryData = {
        countryName:
          countriesList.countries[countryObj['iso2'].toUpperCase()]['name'],
        image:
          countriesList.countries[countryObj['iso2'].toUpperCase()]['emoji'],
        countryAlphaCode: countryObj['iso2'].toUpperCase(),
        countryCode: `+${countryObj['dialCode']}`,
      };

      if (countryObj['dialCode'] === '1') {
        countryData['areaCodes'] = countryObj['areaCodes'];
      }

      // Add US data
      if (countryObj['iso2'].toUpperCase() == 'US') {
        countryData['areaCodes'] = Object.keys(usAreaCodes);
      }

      if (countryData['areaCodes']) {
        countryData.areaCodes = countryData.areaCodes.map(Number);
      }

      countryInformation.push(countryData);
    }
  });

  return countryInformation;
}

function obtainCountryFormatting(countryData) {
  let allCountryData = countryData;
  countryData.forEach((countryObj, index) => {
    if (libphonenumberJS.isSupportedCountry(countryObj.countryAlphaCode)) {
      ('+14082333333'); // 'US'
      ('4082333333');
      '408 233 3333'[(3, 3, 4)];
      let phoneNumber = libphonenumberJS.getExampleNumber(
        countryObj.countryAlphaCode,
        examples,
      );
      let displayFormatting = phoneNumber
        .formatInternational()
        .substring(`${countryObj.countryCode}`.length)
        .split(' ')
        .filter(Boolean)
        .map(num => num.length);
      allCountryData[index]['displayFormat'] = displayFormatting;
    }
  });

  return allCountryData;
}

function findCountriesByCode(countryData, countryCode) {
  let filteredData = countryData.filter(
    countryObj => countryObj.countryCode == countryCode,
  );

  return filteredData;
}

function populationData() {
  return {
    KZ: 18776707,
    RU: 145934462,
    AU: 25499884,
    CX: 1843,
    CC: 544,
    BQ: 20104,
    CW: 164093,
    NO: 5421241,
    SJ: 2667,
    GB: 67886011,
    JE: 97857,
    IM: 84077,
    GG: 67052,
    IT: 60461826,
    VA: 825,
    FI: 5541159,
    AX: 28007,
    US: 331002651,
    CA: 37757861,
  };
}

function insertPopulationData(allData, populationData) {
  let countryData = allData;
  countryData.forEach((countryObj, index) => {
    if (populationData[countryObj.countryAlphaCode]) {
      countryData[index]['population'] =
        populationData[countryObj.countryAlphaCode];
    }
  });

  return countryData;
}

// View the information passed to the user
// console.log(insertPopulationData(obtainCountryFormatting(obtainCountryInformation(intlTelInput)), populationData()));
const allData = insertPopulationData(
  obtainCountryFormatting(obtainCountryInformation(intlTelInput)),
  populationData(),
);

fs.writeFileSync('./index.json', JSON.stringify(allData));
