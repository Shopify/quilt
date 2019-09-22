import createMockCookies from '../create-mock-cookies';

describe('create-mock-cookies', () => {
  it('includes maps for response and request cookie stores', () => {
    const cookies = createMockCookies();
    expect(cookies.requestStore).toBeInstanceOf(Map);
    expect(cookies.responseStore).toBeInstanceOf(Map);
  });

  it('adds all given cookies to the requestStore', () => {
    const values = {
      sessionID: 'something something',
      store: 'shop1',
      referrer: 'somewhere.io',
    };

    const cookies = createMockCookies(values);

    Object.keys(values).forEach(key => {
      const value = values[key];
      expect(cookies.requestStore.get(key)).toBe(value);
    });
  });

  it('sets secure to true by default', () => {
    const secureCookies = createMockCookies();
    expect(secureCookies.secure).toBe(true);
  });

  it('sets secure to the given value', () => {
    const secureCookies = createMockCookies({}, true);
    expect(secureCookies.secure).toBe(true);

    const insecureCookies = createMockCookies({}, false);
    expect(insecureCookies.secure).toBe(false);
  });

  describe('set', () => {
    it('adds to responseStore', () => {
      const cookies = createMockCookies();

      cookies.set('foo', 'bar');

      expect(cookies.responseStore.get('foo')).toBe('bar');
    });
  });

  describe('get', () => {
    it('returns value from requestStore', () => {
      const cookies = createMockCookies({foo: 'bar'});

      cookies.set('foo', 'bar');

      expect(cookies.responseStore.get('foo')).toBe('bar');
    });
  });
});
