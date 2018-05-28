import {isSafe, makeSafe} from '..';

describe('redirectIsSafe()', () => {
  it('is false when the host is empty', () => {
    expect(isSafe('file:///foo/bar')).toBe(false);
    expect(isSafe('///test.com')).toBe(false);
    expect(isSafe('https:///test.com')).toBe(false);
  });

  it('is false when the url is malformed', () => {
    expect(isSafe('foo\\/??/alskfjalsf')).toBe(false);
  });

  it('is true for a relative URI', () => {
    expect(isSafe('/a/b/c')).toBe(true);
  });

  it('is false when the path does not start with a slash', () => {
    expect(isSafe('a/b/c')).toBe(false);
  });

  it('is false when the user info is present', () => {
    expect(isSafe('https://foobar@test.com')).toBe(false);
    expect(isSafe('https://foo:bar@test.com')).toBe(false);
  });

  it('is true for http:', () => {
    expect(isSafe('http://test.com')).toBe(true);
  });

  it('is true for https:', () => {
    expect(isSafe('https://test.com')).toBe(true);
  });

  it('is false for non-http(s) protocols', () => {
    expect(isSafe('ftp://test.com')).toBe(false);
  });

  it('is false when a URL contains newlines', () => {
    expect(isSafe('/a/\n')).toBe(false);
    expect(isSafe('https://test.com/a/\n')).toBe(false);
  });

  describe('requireSSL', () => {
    it('is true for https:', () => {
      expect(isSafe('https://test.com', {requireSSL: true})).toBe(true);
    });

    it('is false for http:', () => {
      expect(isSafe('http://test.com', {requireSSL: true})).toBe(false);
    });
  });

  describe('requireAbsolute', () => {
    it('is true for absolute URIs', () => {
      expect(isSafe('http://test.com/a/b/c', {requireAbsolute: true})).toBe(
        true,
      );
    });

    it('is false for relative URIs', () => {
      expect(isSafe('/a/b/c', {requireAbsolute: true})).toBe(false);
    });
  });

  describe('matchPath', () => {
    it('is true when a string matchPath exactly matches the pathname of an absolute URI', () => {
      expect(isSafe('http://test.com/a', {matchPath: '/a'})).toBe(true);
    });

    it('is true when a string matchPath exactly matches the pathname of a relative URI', () => {
      expect(isSafe('/a', {matchPath: '/a'})).toBe(true);
    });

    it('is false when a string matchPath does not exactly match the pathname of an absolute URI', () => {
      expect(isSafe('http://test.com/a', {matchPath: '/b'})).toBe(false);
      expect(isSafe('http://test.com/b/../a', {matchPath: '/b'})).toBe(false);
      expect(isSafe('http://test.com/b/../a', {matchPath: '/a'})).toBe(false);
    });

    it('is false when a string matchPath matches the pathname of a relative URI', () => {
      expect(isSafe('/a', {matchPath: '/b'})).toBe(false);
      expect(isSafe('/b/../a', {matchPath: '/b'})).toBe(false);
      expect(isSafe('/b/../a', {matchPath: '/a'})).toBe(false);
    });

    it('is true when a regex matchPath matches the pathname of an absolute URI', () => {
      expect(isSafe('http://test.com/a/b', {matchPath: /b/})).toBe(true);
      expect(isSafe('http://test.com/b/../a/b', {matchPath: /b/})).toBe(true);
    });

    it('is true when a regex matchPath matches the pathname of a relative URI', () => {
      expect(isSafe('/a/b', {matchPath: /b/})).toBe(true);
      expect(isSafe('/b/../a/b', {matchPath: /b/})).toBe(true);
    });

    it('is false when a regex matchPath does not match the pathname of a relative URI', () => {
      expect(isSafe('/a', {matchPath: /b/})).toBe(false);
      expect(isSafe('/b/../a', {matchPath: /b/})).toBe(false);
      expect(isSafe('/b/../a', {matchPath: /^\/a/})).toBe(false);
      expect(isSafe('/b/../a', {matchPath: /^\/b/})).toBe(false);
    });

    it('is false when a regex matchPath does not match the pathname of an absolute URI', () => {
      expect(isSafe('http://test.com/a', {matchPath: /b/})).toBe(false);
      expect(isSafe('http://test.com/b/../a', {matchPath: /b/})).toBe(false);
      expect(isSafe('http://test.com/b/../a', {matchPath: /^\/b/})).toBe(false);
      expect(isSafe('http://test.com/b/../a', {matchPath: /^\/b/})).toBe(false);
    });
  });

  describe('whitelist', () => {
    it('is true for hostnames in the whitelist', () => {
      expect(
        isSafe('http://test2.com/a/b/c', {
          whitelist: ['test1.com', 'test2.com'],
        }),
      ).toBe(true);
    });

    it('is false for hostnames that do not match exactly', () => {
      expect(
        isSafe('http://a.test2.com/a/b/c', {
          whitelist: ['test1.com', 'test2.com'],
        }),
      ).toBe(false);
    });

    it('is false for hostnames outside the whitelist', () => {
      expect(
        isSafe('http://test2.com/a/b/c', {
          whitelist: ['test1.com'],
        }),
      ).toBe(false);
    });

    it('is false for relative URIs', () => {
      expect(isSafe('/a/b/c', {whitelist: ['test.com']})).toBe(false);
    });
  });

  describe('subdomains', () => {
    it('throws an error when some subdomains do not begin with .', () => {
      expect(() => {
        isSafe('http://test.com', {subdomains: ['.one.com', 'two.com']});
      }).toThrowError();
    });

    it('is true for subdomains that are at the end of the URL', () => {
      expect(
        isSafe('http://zero.two.com/a/b/c', {
          subdomains: ['.one.com', '.two.com'],
        }),
      ).toBe(true);
    });

    it('is false for subdomains that are not at the end of the URL', () => {
      expect(
        isSafe('http://zero.three.com/a/b/c', {
          subdomains: ['.one.com', '.two.com'],
        }),
      ).toBe(false);
    });

    it('is false for relative URIs', () => {
      expect(isSafe('/a/b/c', {subdomains: ['.test.com']})).toBe(false);
    });
  });

  it('works when both whitelist and subdomains are specified', () => {
    expect(
      isSafe('http://abc.com/a/b/c', {
        whitelist: ['abc.com', 'def.com'],
        subdomains: ['.ghi.com', '.jkl.com'],
      }),
    ).toBe(true);
    expect(
      isSafe('http://def.com/a/b/c', {
        whitelist: ['abc.com', 'def.com'],
        subdomains: ['.ghi.com', '.jkl.com'],
      }),
    ).toBe(true);
    expect(
      isSafe('http://sub1.ghi.com/a/b/c', {
        whitelist: ['abc.com', 'def.com'],
        subdomains: ['.ghi.com', '.jkl.com'],
      }),
    ).toBe(true);
    expect(
      isSafe('http://sub1.jkl.com/a/b/c', {
        whitelist: ['abc.com', 'def.com'],
        subdomains: ['.ghi.com', '.jkl.com'],
      }),
    ).toBe(true);
    expect(
      isSafe('http://abc.com.invalid/a/b/c', {
        whitelist: ['abc.com', 'def.com'],
        subdomains: ['.ghi.com', '.jkl.com'],
      }),
    ).toBe(false);
    expect(
      isSafe('http://jkl.com.invalid/a/b/c', {
        whitelist: ['abc.com', 'def.com'],
        subdomains: ['.ghi.com', '.jkl.com'],
      }),
    ).toBe(false);
  });
});

describe('makeSafe()', () => {
  it('returns the URL when it is safe', () => {
    expect(makeSafe('/a', '/b')).toBe('/a');
  });

  it('returns the default when the URL is not safe', () => {
    expect(makeSafe('/a', '/b', {requireAbsolute: true})).toBe('/b');
  });
});
