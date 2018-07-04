import {Address, FieldName, Country, Province} from './types';

const FIELD_REGEXP = /({\w+})/g;
export const FIELDS_MAPPING: {
  [key: string]: FieldName;
} = {
  '{firstName}': FieldName.FirstName, // eslint-disable-line id-length
  '{lastName}': FieldName.LastName, // eslint-disable-line id-length
  '{country}': FieldName.Country, // eslint-disable-line id-length
  '{city}': FieldName.City, // eslint-disable-line id-length
  '{zip}': FieldName.Zip, // eslint-disable-line id-length
  '{province}': FieldName.Province, // eslint-disable-line id-length
  '{address1}': FieldName.Address1, // eslint-disable-line id-length
  '{address2}': FieldName.Address2, // eslint-disable-line id-length
  '{phone}': FieldName.Phone, // eslint-disable-line id-length
  '{company}': FieldName.Company, // eslint-disable-line id-length
};

/*
 * Returns empty string if all replacement fields are empty.
 */
export function renderLineTemplate(
  country: Country,
  template: string,
  address: Address,
): string {
  const result = template.match(FIELD_REGEXP);
  let line = template;

  if (!result) {
    return '';
  }

  let lineIsEmpty = true;
  result.forEach(key => {
    const addressKey = key.replace('{', '').replace('}', '') as FieldName;

    if (address[addressKey]) {
      lineIsEmpty = false;
    }

    switch (addressKey) {
      case FieldName.Country:
        line = line.replace(`{${FieldName.Country}}`, country.attributes.name);
        break;
      case FieldName.Province:
        line = line.replace(
          `{${FieldName.Province}}`,
          address.province
            ? getProvince(country.attributes.provinces, address.province).name
            : '',
        );
        break;
      default:
        line = line.replace(key, address[addressKey] || '');
        break;
    }
  });
  if (lineIsEmpty) {
    return '';
  } else {
    return line.trim();
  }
}

function getProvince(provinces: Province[], provinceCode: string): Province {
  return (
    provinces.find(province => province.code === provinceCode) || {
      name: '',
      code: '',
    }
  );
}
