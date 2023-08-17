import {hasFamilyNameGivenNameOrdering} from '../hasFamilyNameGivenNameOrdering';

describe('#hasFamilyNameGivenNameOrdering()', () => {
  it('returns true if defaultFamilyNameGivenNameOrderingFormatter exists', () => {
    expect(hasFamilyNameGivenNameOrdering('ja')).toBe(true);
  });

  it('returns false if defaultFamilyNameGivenNameOrderingFormatter does not exist', () => {
    expect(hasFamilyNameGivenNameOrdering('en')).toBe(false);
  });
});
