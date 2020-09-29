import {ServerCookieManager} from '../ServerCookieManager';

describe('ServerCookieManager', () => {
  it('returns all cookies as an object', () => {
    const cookies = 'foo=bar;baz=qux';
    const manager = new ServerCookieManager(cookies);

    expect(manager.getCookies()).toStrictEqual({
      baz: {
        value: 'qux',
      },
      foo: {
        value: 'bar',
      },
    });
  });

  it('sets additional cookies', () => {
    const cookies = 'foo=bar;baz=qux';
    const manager = new ServerCookieManager(cookies);

    manager.setCookie('quux', 'quuz');

    expect(manager.getCookies()).toStrictEqual({
      baz: {
        value: 'qux',
      },
      foo: {
        value: 'bar',
      },
      quux: {
        value: 'quuz',
      },
    });
  });

  it('returns an individual cookie values from a given name', () => {
    const cookies = 'foo=bar;baz=qux';
    const manager = new ServerCookieManager(cookies);

    expect(manager.getCookie('foo')).toBe('bar');
    expect(manager.getCookie('baz')).toBe('qux');
  });

  it('removes an individual cookie by name', () => {
    const cookies = 'foo=bar;baz=qux';
    const manager = new ServerCookieManager(cookies);

    manager.removeCookie('foo');

    expect(manager.getCookies().foo).toMatchObject({
      expires: new Date('Thu, 01 Jan 1970 00:00:01 GMT'),
      value: '',
    });
  });
});
