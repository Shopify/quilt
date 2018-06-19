import {
  SRI_HASH_ALGORITHMS,
  calculateBase64IntegrityFromFilename,
} from '../../integrity-sha-utils';

const path =
  'app-d66c7d40c1a1b12699089e33517fd5a27a96d4495379bff236c239b415c06434.js';

describe('#calculateBase64IntegrityFromFilename', () => {
  it('returns a base64 hash using sha256 hash function', () => {
    expect(calculateBase64IntegrityFromFilename(path, 'sha256', 'hex')).toMatch(
      /sha256-.{44}$/,
    );
  });

  it('returns a base64 hash using sha238 hash function', () => {
    expect(calculateBase64IntegrityFromFilename(path, 'sha384', 'hex')).toMatch(
      /sha384-.{44}$/,
    );
  });

  it('returns a base64 hash using sha512 hash function', () => {
    expect(calculateBase64IntegrityFromFilename(path, 'sha512', 'hex')).toMatch(
      /sha512-.{44}$/,
    );
  });

  it('returns false when an unsupported hash function is used', () => {
    expect(calculateBase64IntegrityFromFilename(path, 'sha128', 'hex')).toBe(
      false,
    );
  });

  it('returns false when an invalid path is used', () => {
    expect(
      calculateBase64IntegrityFromFilename('foo.js', 'sha256', 'hex'),
    ).toBe(false);
  });

  it('returns false when an invalid and hash digest is used', () => {
    expect(calculateBase64IntegrityFromFilename(path, 'sha256', 'utf8')).toBe(
      false,
    );
  });
});
