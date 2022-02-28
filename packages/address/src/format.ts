import {Address, Country, FieldName} from '@shopify/address-consts';

import {FIELDS_MAPPING, FIELD_REGEXP, renderLineTemplate} from './utilities';

const LINE_DELIMITER = '_';
const DEFAULT_FORM_LAYOUT =
  '{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}';
const DEFAULT_SHOW_LAYOUT =
  '{lastName} {firstName}_{company}_{address1} {address2}_{city} {province} {zip}_{country}_{phone}';

/**
 * When it's time to render any address, use this function so that it's properly
 * formatted for the country's locale.
 *
 * ```typescript
 * ['Shopify', 'Lindenstraße 9-14', '10969 Berlin', 'Germany'];
 * ```
 * @returns all lines of a formatted address as an array of strings.
 */
export function formatAddress(address: Address, country: Country): string[] {
  const layout = country.formatting.show || DEFAULT_SHOW_LAYOUT;
  return layout
    .split(LINE_DELIMITER)
    .map((lineTemplate) =>
      renderLineTemplate(country, lineTemplate, address).trim(),
    );
}

/**
 * In an edit form, this function can be used to properly order all the input
 * fields.
 *
 * ```typescript
 * [
 *   ['firstName', 'lastName'],
 *   ['company'],
 *   ['address1'],
 *   ['address2'],
 *   ['city'],
 *   ['country', 'province', 'zip'],
 *   ['phone'],
 * ];
 * ```
 */
export function buildOrderedFields(country: Country): FieldName[][] {
  const format = country ? country.formatting.edit : DEFAULT_FORM_LAYOUT;

  return format.split(LINE_DELIMITER).map((lineTemplate) => {
    const result = lineTemplate.match(FIELD_REGEXP);
    if (!result) {
      return [];
    }
    return result.map((field) => FIELDS_MAPPING[field]);
  });
}
