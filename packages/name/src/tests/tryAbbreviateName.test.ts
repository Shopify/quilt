import {tryAbbreviateName} from '../abbreviateName';

describe('tryAbbreviateName()', () => {
  it('ignores leading or trailing whitespaces when creating abbreviation', () => {
    expect(
      tryAbbreviateName({givenName: ' Michael ', familyName: ' Garfinkle '}),
    ).toBe('MG');
  });

  it('returns undefined if given name or family name contains punctuation or white spaces', () => {
    const testCases = [
      {givenName: 'Michael', familyName: 'Garfinkle-Smith'},
      {givenName: 'Mr.', familyName: 'Garfinkle'},
      {givenName: 'Michael', familyName: 'van der Garfinkle'},
    ];

    testCases.forEach((testCase) => {
      expect(tryAbbreviateName(testCase)).toBeUndefined();
    });
  });

  it('returns undefined if contains mixed languages', () => {
    const testCases = [
      {givenName: 'คEวง', familyName: 'อภัADSยวงศ์'},
      {givenName: 'アイ', familyName: 'Garfinkle'},
    ];

    testCases.forEach((testCase) => {
      expect(tryAbbreviateName(testCase)).toBeUndefined();
    });
  });

  it('returns undefined when given name and family name are undefined', () => {
    expect(
      tryAbbreviateName({givenName: undefined, familyName: undefined}),
    ).toBeUndefined();
  });

  it('latin script returns first letter of family name if given name is nil or empty', () => {
    expect(
      tryAbbreviateName({
        givenName: '',
        familyName: 'Garfinkle',
      }),
    ).toBe('G');
    expect(
      tryAbbreviateName({
        givenName: undefined,
        familyName: 'Garfinkle',
      }),
    ).toBe('G');
  });

  it('latin script returns first letter of given name if family name is nil or empty', () => {
    expect(
      tryAbbreviateName({
        givenName: 'Michael',
        familyName: '',
      }),
    ).toBe('M');
    expect(
      tryAbbreviateName({
        givenName: 'Michael',
        familyName: undefined,
      }),
    ).toBe('M');
  });

  it('latin script returns first letter of given name and family name if these are both defined', () => {
    expect(
      tryAbbreviateName({
        givenName: 'Michael',
        familyName: 'Garfinkle',
      }),
    ).toBe('MG');
  });

  it('chinese/japanese script returns family name, regardless of given name', () => {
    expect(
      tryAbbreviateName({
        givenName: '',
        familyName: '愛莉',
      }),
    ).toBe('愛莉');
    expect(
      tryAbbreviateName({
        givenName: undefined,
        familyName: 'アイ',
      }),
    ).toBe('アイ');
    expect(
      tryAbbreviateName({
        givenName: 'エ',
        familyName: 'エリ',
      }),
    ).toBe('エリ');
    expect(
      tryAbbreviateName({
        givenName: 'エ',
        familyName: undefined,
      }),
    ).toBeUndefined();
  });

  it('korean script returns given name if < 4 characters in length when ideal_max_length is not set', () => {
    expect(
      tryAbbreviateName({
        givenName: '이슬',
        familyName: '재현',
      }),
    ).toBe('이슬');
    expect(
      tryAbbreviateName({
        givenName: '하야나',
        familyName: '재현',
      }),
    ).toBe('하야나');
  });

  it('korean script returns first letter of given name if > 3 characters in length when ideal_max_length is not set"', () => {
    const abbreviation = tryAbbreviateName({
      givenName: '이슬슬슬',
      familyName: '재현',
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-conditional-in-test
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('이');
    }
  });

  it('korean script returns first letter of given name if > ideal_max_length characters in length when this is set"', () => {
    const abbreviation = tryAbbreviateName({
      givenName: '이슬',
      familyName: '재현',
      idealMaxLength: 1,
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-conditional-in-test
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('이');
    }
  });

  it('korean script returns family name if given name is undefined or empty"', () => {
    expect(
      tryAbbreviateName({
        givenName: '',
        familyName: '재현',
      }),
    ).toBe('재현');
    expect(
      tryAbbreviateName({
        givenName: undefined,
        familyName: '재현',
      }),
    ).toBe('재현');
  });

  it('thai script returns first letter of given name', () => {
    const abbreviation = tryAbbreviateName({
      givenName: 'ควง',
      familyName: 'อภัยวงศ์',
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-conditional-in-test
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('ค');
    }
  });

  it('thai script returns first letter of family name if given name is undefined or empty', () => {
    let abbreviation = tryAbbreviateName({
      givenName: '',
      familyName: 'อภัยวงศ์',
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-conditional-in-test
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('อ');
    }

    abbreviation = tryAbbreviateName({
      givenName: undefined,
      familyName: 'อภัยวงศ์',
    });
    /* eslint-disable jest/no-conditional-in-test */
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('อ');
    }
    /* eslint-enable jest/no-conditional-in-test */
  });
});

function nodeMajorVersion(): number {
  return Number(process.versions.node.split('.')[0]);
}
