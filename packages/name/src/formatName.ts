import {FAMILY_NAME_GIVEN_NAME_ORDERING_INDEXED_BY_LANGUAGE} from './constants';
import {languageFromLocale} from './utilities';
import {nonEmptyOrUndefined} from './utilities/nonEmptyOrUndefined';

// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/name_formatter.rb.
export function formatName({
  name,
  locale,
  options,
}: {
  name: {givenName?: string | null; familyName?: string | null};
  locale: string;
  options?: {full?: boolean};
}) {
  const givenName = nonEmptyOrUndefined(name?.givenName);
  const familyName = nonEmptyOrUndefined(name?.familyName);

  if (familyName && !givenName) {
    return familyName;
  }

  if (givenName && !familyName) {
    return givenName;
  }

  if (givenName && familyName) {
    const isFullName = Boolean(options && options.full);

    const customNameFormatter =
      FAMILY_NAME_GIVEN_NAME_ORDERING_INDEXED_BY_LANGUAGE.get(
        languageFromLocale(locale),
      );

    if (customNameFormatter) {
      return customNameFormatter(givenName, familyName, isFullName);
    }

    if (isFullName) {
      return `${givenName} ${familyName}`;
    }
  }

  return givenName;
}
