const query = `
query countries($locale: SupportedLocale!) {
  countries(locale: $locale) {
    name
    code
    phoneNumberPrefix
    address2Key
    provinceKey
    zipKey
    formatting {
      edit
      show
    }
    provinces {
      name
      code
    }
  }
}

query country($countryCode: SupportedCountry!, $locale: SupportedLocale!) {
  country(countryCode: $countryCode, locale: $locale) {
    name
    code
    phoneNumberPrefix
    address2Key
    provinceKey
    zipKey
    formatting {
      edit
      show
    }
    provinces {
      name
      code
    }
  }
}
`;

export default query;
