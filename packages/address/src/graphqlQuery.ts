const query = `
query countries($locale: SupportedLocale!) {
  countries(locale: $locale) {
    name
    code
    continent
    phoneNumberPrefix
    autocompletionField
    provinceKey
    labels {
      address1
      address2
      city
      company
      country
      firstName
      lastName
      phone
      postalCode
      zone
    }
    optionalLabels {
      address2
    }
    formatting {
      edit
      show
    }
    zones {
      name
      code
    }
  }
}

query country($countryCode: SupportedCountry!, $locale: SupportedLocale!) {
  country(countryCode: $countryCode, locale: $locale) {
    name
    code
    continent
    phoneNumberPrefix
    autocompletionField
    provinceKey
    labels {
      address1
      address2
      city
      company
      country
      firstName
      lastName
      phone
      postalCode
      zone
    }
    optionalLabels {
      address2
    }
    formatting {
      edit
      show
    }
    zones {
      name
      code
    }
  }
}
`;

export default query;
