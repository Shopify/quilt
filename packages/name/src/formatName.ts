import {FAMILY_NAME_GIVEN_NAME_ORDERING} from './constants';

// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/name_formatter.rb.
export function formatName({
  name,
  locale,
  options,
}: {
  name: {givenName?: string; familyName?: string};
  locale: string;
  options?: {full?: boolean};
}) {
  if (!name.givenName) {
    return name.familyName || '';
  }
  if (!name.familyName) {
    return name.givenName;
  }

  const isFullName = Boolean(options && options.full);

  const customNameFormatter = FAMILY_NAME_GIVEN_NAME_ORDERING.get(locale);

  if (customNameFormatter) {
    return customNameFormatter(name.givenName, name.familyName, isFullName);
  }
  if (isFullName) {
    return `${name.givenName} ${name.familyName}`;
  }
  return name.givenName;
}
