import {nonEmptyOrUndefined} from '../nonEmptyOrUndefined';

describe('#nonEmptyOrUndefined()', () => {
  it('returns undefined', () => {
    const testCases = [undefined, null, '', ' '];
    testCases.forEach((testCase) => {
      expect(nonEmptyOrUndefined(testCase)).toBeUndefined();
    });
  });

  it('returns trimmed value', () => {
    const testCases = ['text', ' text', ' text '];
    testCases.forEach((testCase) => {
      expect(nonEmptyOrUndefined(testCase)).toBe('text');
    });
  });
});
