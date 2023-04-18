import {tryAbbreviateName} from '../tryAbbreviateName';

describe('tryAbbreviateName', () => {
  it('ignores leading or trailing whitespaces when creating abbreviation', () => {
    expect(
      tryAbbreviateName({firstName: ' Michael ', lastName: ' Garfinkle '}),
    ).toBe('MG');
  });

  it('returns undefined if first or last name contains punctuation or white spaces', () => {
    const testCases = [
      {firstName: 'Michael', lastName: 'Garfinkle-Smith'},
      {firstName: 'Mr.', lastName: 'Garfinkle'},
      {firstName: 'Michael', lastName: 'van der Garfinkle'},
    ];

    testCases.forEach((testCase) => {
      expect(tryAbbreviateName(testCase)).toBeUndefined();
    });
  });

  it('returns undefined if contains mixed languages', () => {
    const testCases = [
      {firstName: 'คEวง', lastName: 'อภัADSยวงศ์'},
      {firstName: 'アイ', lastName: 'Garfinkle'},
    ];

    testCases.forEach((testCase) => {
      expect(tryAbbreviateName(testCase)).toBeUndefined();
    });
  });

  it('returns undefined when first and last name are undefined', () => {
    expect(
      tryAbbreviateName({firstName: undefined, lastName: undefined}),
    ).toBeUndefined();
  });

  it('latin script returns first letter of last name if first name is nil or empty', () => {
    expect(
      tryAbbreviateName({
        firstName: '',
        lastName: 'Garfinkle',
      }),
    ).toBe('G');
    expect(
      tryAbbreviateName({
        firstName: undefined,
        lastName: 'Garfinkle',
      }),
    ).toBe('G');
  });

  it('latin script returns first letter of first name if last name is nil or empty', () => {
    expect(
      tryAbbreviateName({
        firstName: 'Michael',
        lastName: '',
      }),
    ).toBe('M');
    expect(
      tryAbbreviateName({
        firstName: 'Michael',
        lastName: undefined,
      }),
    ).toBe('M');
  });

  it('latin script returns first letter of first and last name if these are both defined', () => {
    expect(
      tryAbbreviateName({
        firstName: 'Michael',
        lastName: 'Garfinkle',
      }),
    ).toBe('MG');
  });

  it('chinese/japanese script returns last name, regardless of first name', () => {
    expect(
      tryAbbreviateName({
        firstName: '',
        lastName: '愛莉',
      }),
    ).toBe('愛莉');
    expect(
      tryAbbreviateName({
        firstName: undefined,
        lastName: 'アイ',
      }),
    ).toBe('アイ');
    expect(
      tryAbbreviateName({
        firstName: 'エ',
        lastName: 'エリ',
      }),
    ).toBe('エリ');
    expect(
      tryAbbreviateName({
        firstName: 'エ',
        lastName: undefined,
      }),
    ).toBeUndefined();
  });

  it('korean script returns first name if < 4 characters in length when ideal_max_length is not set', () => {
    expect(
      tryAbbreviateName({
        firstName: '이슬',
        lastName: '재현',
      }),
    ).toBe('이슬');
    expect(
      tryAbbreviateName({
        firstName: '하야나',
        lastName: '재현',
      }),
    ).toBe('하야나');
  });

  it('korean script returns first letter of first name if > 3 characters in length when ideal_max_length is not set"', () => {
    const abbreviation = tryAbbreviateName({
      firstName: '이슬슬슬',
      lastName: '재현',
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-if
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('이');
    }
  });

  it('korean script returns first letter of first name if > ideal_max_length characters in length when this is set"', () => {
    const abbreviation = tryAbbreviateName({
      firstName: '이슬',
      lastName: '재현',
      idealMaxLength: 1,
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-if
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('이');
    }
  });

  it('korean script returns last name if first name is undefined or empty"', () => {
    expect(
      tryAbbreviateName({
        firstName: '',
        lastName: '재현',
      }),
    ).toBe('재현');
    expect(
      tryAbbreviateName({
        firstName: undefined,
        lastName: '재현',
      }),
    ).toBe('재현');
  });

  it('thai script returns first letter of first name', () => {
    const abbreviation = tryAbbreviateName({
      firstName: 'ควง',
      lastName: 'อภัยวงศ์',
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-if
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('ค');
    }
  });

  it('thai script returns first letter of last name if first name is undefined or empty', () => {
    let abbreviation = tryAbbreviateName({
      firstName: '',
      lastName: 'อภัยวงศ์',
    });
    // UNLESS Node version ≤ 14, in which case returns undefined as Intl.Segmenter is not available in this context
    // eslint-disable-next-line jest/no-if
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('อ');
    }

    abbreviation = tryAbbreviateName({
      firstName: undefined,
      lastName: 'อภัยวงศ์',
    });
    if (nodeMajorVersion() <= 14) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBeUndefined();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(abbreviation).toBe('อ');
    }
  });
});

function nodeMajorVersion(): number {
  return Number(process.versions.node.split('.')[0]);
}
