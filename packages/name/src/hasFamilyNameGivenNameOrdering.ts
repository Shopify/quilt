import {FAMILY_NAME_GIVEN_NAME_ORDERING} from './constants';

export function hasFamilyNameGivenNameOrdering(locale: string) {
  const familyNameGivenNameOrdering =
    FAMILY_NAME_GIVEN_NAME_ORDERING.get(locale);
  return Boolean(familyNameGivenNameOrdering);
}
