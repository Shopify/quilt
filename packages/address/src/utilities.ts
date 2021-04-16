import {Address, FieldName, Country, Zone} from '@shopify/address-consts';

export const FIELD_REGEXP = /({\w+})/g;
export const FIELDS_MAPPING: {
  [key: string]: FieldName;
} = {
  '{firstName}': FieldName.FirstName,
  '{lastName}': FieldName.LastName,
  '{country}': FieldName.Country,
  '{city}': FieldName.City,
  '{zip}': FieldName.PostalCode,
  '{province}': FieldName.Zone,
  '{address1}': FieldName.Address1,
  '{address2}': FieldName.Address2,
  '{phone}': FieldName.Phone,
  '{company}': FieldName.Company,
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
  result.forEach((key) => {
    const addressKey = key.replace('{', '').replace('}', '') as FieldName;

    if (address[addressKey]) {
      lineIsEmpty = false;
    }

    switch (addressKey) {
      case FieldName.Country:
        line = line.replace(`{${FieldName.Country}}`, country.name);
        break;
      case FieldName.Zone:
        line = line.replace(
          `{${FieldName.Zone}}`,
          address.province ? getZone(country.zones, address.province).name : '',
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
    return line.trim().replace('  ', ' ');
  }
}

function getZone(zones: Zone[], zoneCode: string): Zone {
  return (
    zones.find((zone) => zone.code === zoneCode) || {
      name: '',
      code: '',
    }
  );
}
