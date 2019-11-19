import {generateID} from '../utilities';

describe('generateID', () => {
  it('generate an ID with the filename as the prefix', () => {
    expect(generateID('abc/path/to/something/FileName.tsx')).toMatch(
      /^FileName_/,
    );
  });

  it('generate the same ID with the same file path', () => {
    const filePath = 'abc/path/to/something/FileName.tsx';

    expect(generateID(filePath)).toMatch(generateID(filePath));
  });

  it('generate different ID with the different file path', () => {
    expect(generateID('abc/path1/to/something/FileName.tsx')).not.toMatch(
      generateID('abc/path2/to/something/FileName.tsx'),
    );
  });
});
