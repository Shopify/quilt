import {tryAbbreviateBusinessName} from '../abbreviateBusinessName';

describe('tryAbbreviateBusinessName()', () => {
  it('ignores leading or trailing whitespaces', () => {
    expect(tryAbbreviateBusinessName({name: ' A Better Looking Shop '})).toBe(
      'AS',
    );
  });

  it('returns undefined if mixed languages', () => {
    expect(tryAbbreviateBusinessName({name: 'อภัADSยวงศ์'})).toBeUndefined();
  });

  it('returns undefined if no accepted languages', () => {
    expect(tryAbbreviateBusinessName({name: '😀😃😄'})).toBeUndefined();
  });

  it('returns undefined if empty string', () => {
    expect(tryAbbreviateBusinessName({name: ''})).toBeUndefined();
  });

  it('returns up to first 3 letters of name when idealMaxLength is not set when latin script and only one word', () => {
    const cases = [
      {name: 'Shop1', idealMaxLength: 4, expectedAbbreviation: 'Shop'},
      {name: 'Shop1', idealMaxLength: 7, expectedAbbreviation: 'Shop1'},
    ];

    cases.forEach((testCase) => {
      const abbreviatedName = tryAbbreviateBusinessName({
        name: testCase.name,
        idealMaxLength: testCase.idealMaxLength,
      });
      expect(abbreviatedName).toBe(testCase.expectedAbbreviation);
    });
  });

  it('returns first letter of first word and last word when latin script and number of words is greater than 3 and idealMaxLength not set', () => {
    expect(tryAbbreviateBusinessName({name: ' A Better Looking Shop '})).toBe(
      'AS',
    );
  });

  it('returns first letter of all words when latin script and idealMaxLength is greater than or equal to the number of words', () => {
    expect(
      tryAbbreviateBusinessName({
        name: 'A Better Looking Shop',
        idealMaxLength: 4,
      }),
    ).toBe('ABLS');
  });

  it('returns undefined if thai script and more than one word', () => {
    expect(tryAbbreviateBusinessName({name: 'ปูนซ ปูนซ'})).toBeUndefined();
  });

  it('returns first letter of name, no matter idealMaxLength', () => {
    const cases = [
      {
        name: 'ปูนซิเมนต์ไทย',
        idealMaxLength: undefined,
        expectedAbbreviation: 'ปู',
      },
      {name: 'ปูนซิเมนต์ไทย', idealMaxLength: 20, expectedAbbreviation: 'ปู'},
    ];

    cases.forEach((testCase) => {
      const abbreviatedName = tryAbbreviateBusinessName({
        name: testCase.name,
        idealMaxLength: testCase.idealMaxLength,
      });
      // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
      // eslint-disable-next-line jest/no-conditional-in-test
      if (nodeMajorVersion() <= 14) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(abbreviatedName).toBeUndefined();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(abbreviatedName).toBe(testCase.expectedAbbreviation);
      }
    });
  });

  it('returns name when chinese script and only one word', () => {
    expect(tryAbbreviateBusinessName({name: '国家电网'})).toBe('国家电网');
  });

  it('returns undefined when chinese script and more than one word', () => {
    expect(
      tryAbbreviateBusinessName({name: '国家电网 国家电网'}),
    ).toBeUndefined();
  });

  it('returns name when japanese script and only one word', () => {
    expect(tryAbbreviateBusinessName({name: '任天堂'})).toBe('任天堂');
  });

  it('returns undefined when japanese script and more than one word', () => {
    expect(tryAbbreviateBusinessName({name: '任天堂 任天堂'})).toBeUndefined();
  });

  it('returns first few letters of first word, up to three letters, no matter how many words, when korean script and idealMaxLength is not set', () => {
    const cases = [
      {
        name: '삼성 한국어 성삼 한국어',
        expectedAbbreviation: '삼성',
      },
      {name: '삼성한어 한국어 성삼 한국어', expectedAbbreviation: '삼성한'},
    ];

    cases.forEach((testCase) => {
      const abbreviatedName = tryAbbreviateBusinessName({
        name: testCase.name,
      });
      // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
      // eslint-disable-next-line jest/no-conditional-in-test
      if (nodeMajorVersion() <= 14) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(abbreviatedName).toBeUndefined();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(abbreviatedName).toBe(testCase.expectedAbbreviation);
      }
    });
  });

  it('returns first few letters of first word, up to idealMaxLength, no matter how many words, when korean script and idealMaxLength is set', () => {
    const cases = [
      {
        name: '삼성 한국어 성삼 한국어',
        idealMaxLength: 1,
        expectedAbbreviation: '삼',
      },
      {
        name: '삼성한어 한국어 성삼 한국어',
        idealMaxLength: 2,
        expectedAbbreviation: '삼성',
      },
    ];

    cases.forEach((testCase) => {
      const abbreviatedName = tryAbbreviateBusinessName({
        name: testCase.name,
        idealMaxLength: testCase.idealMaxLength,
      });
      // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
      // eslint-disable-next-line jest/no-conditional-in-test
      if (nodeMajorVersion() <= 14) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(abbreviatedName).toBeUndefined();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(abbreviatedName).toBe(testCase.expectedAbbreviation);
      }
    });
  });
});

function nodeMajorVersion(): number {
  return Number(process.versions.node.split('.')[0]);
}
