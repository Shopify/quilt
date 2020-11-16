const fs = require('fs');

const countriesList = require('countries-list');
const intlTelInput = require('intl-tel-input/build/js/data');
const libphonenumberJS = require('libphonenumber-js');
const examples = require('libphonenumber-js/examples.mobile.json');
const usAreaCodes = require('us-area-codes/data/codes.json');
const countriesDB = require('countries-db');

function obtainCountryInformation(telephoneData) {
  return telephoneData.map(countryObj => {
    const countryData = {
      countryName: countriesList.countries[countryObj.iso2.toUpperCase()].name,
      image: countriesList.countries[countryObj.iso2.toUpperCase()].emoji,
      countryAlphaCode: countryObj.iso2.toUpperCase(),
      countryCode: `+${countryObj.dialCode}`,
    };

    if (countryObj.dialCode === '1') {
      countryData.areaCodes = countryObj.areaCodes;

      if (countryObj.iso2.toUpperCase() === 'US') {
        countryData.areaCodes = Object.keys(usAreaCodes);
      }
      countryData.areaCodes = countryData.areaCodes.map(Number);
    }

    return countryData;
  });
}

function obtainCountryFormatting(countryData) {
  return countryData.map(countryObj => {
    if (!libphonenumberJS.isSupportedCountry(countryObj.countryAlphaCode)) {
      return countryObj;
    }

    const phoneNumber = libphonenumberJS.getExampleNumber(
      countryObj.countryAlphaCode,
      examples,
    );

    /* Phone Number Formatting (US Example):
      1. '+14082333333'  Obtain the example phone number
      2. '4082333333'    Remove the country code
      3. '408 233 3333'  Format phone number according to country rules
      4. [3, 3, 4]       Construct the array for display formatting
    */
    const displayFormatting = phoneNumber
      .formatInternational()
      .substring(countryObj.countryCode.length + 1)
      .split(' ')
      .map(num => num.length);

    countryObj.displayFormat = displayFormatting;
    return countryObj;
  });
}

function obtainPopulationData(countryData) {
  return countryData.map(countryObj => {
    if (
      countriesDB.getCountry(countryObj.countryAlphaCode, 'population') === null
    ) {
      return countryObj;
    }

    countryObj.population = countriesDB.getCountry(
      countryObj.countryAlphaCode,
      'population',
    );

    return countryObj;
  });
}

// View the information passed to the user
const allData = obtainPopulationData(
  obtainCountryFormatting(obtainCountryInformation(intlTelInput)),
);

fs.writeFileSync('./index.json', JSON.stringify(allData));
