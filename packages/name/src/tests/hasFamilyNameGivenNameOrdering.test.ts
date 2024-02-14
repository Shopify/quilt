import {hasFamilyNameGivenNameOrdering} from '../hasFamilyNameGivenNameOrdering';

describe('#hasFamilyNameGivenNameOrdering()', () => {
  it('returns true if defaultFamilyNameGivenNameOrderingFormatter exists', () => {
    expect(hasFamilyNameGivenNameOrdering('ja-JP')).toBe(true);
  });

  it('returns false if defaultFamilyNameGivenNameOrderingFormatter does not exist', () => {
    expect(hasFamilyNameGivenNameOrdering('en-CA')).toBe(false);
  });

  it('behaves similarly if we pass language instead of locale', () => {
    expect(hasFamilyNameGivenNameOrdering('ja')).toBe(true);
  });
});
