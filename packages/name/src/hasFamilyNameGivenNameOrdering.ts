import {FAMILY_NAME_GIVEN_NAME_ORDERING_INDEXED_BY_LANGUAGE} from './constants';
import {languageFromLocale} from './utilities';

export function hasFamilyNameGivenNameOrdering(locale: string) {
  const familyNameGivenNameOrdering =
    FAMILY_NAME_GIVEN_NAME_ORDERING_INDEXED_BY_LANGUAGE.get(
      languageFromLocale(locale),
    );
  return Boolean(familyNameGivenNameOrdering);
}
