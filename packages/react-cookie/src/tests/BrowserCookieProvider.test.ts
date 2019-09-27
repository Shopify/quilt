import {BrowserCookieManager} from '../BrowserCookieManager';

describe('cookies', () => {
  it('returns undefined when getting a cookie that does not exist', () => {
    const manager = new BrowserCookieManager();

    expect(manager.getCookie('foo')).toBeUndefined();
  });

  it('returns cookies when getting a previously set cookie', () => {
    document.cookie = 'foo=bar;';
    const manager = new BrowserCookieManager();

    expect(manager.getCookie('foo')).toBe('bar');
    expect(manager.getCookie('baz')).toBeUndefined();
  });

  it('returns cookies after they are set', () => {
    const manager = new BrowserCookieManager();

    manager.setCookie('foo', 'bar');

    expect(manager.getCookie('foo')).toBe('bar');
  });

  it('returns all cookies', () => {
    const manager = new BrowserCookieManager();

    manager.setCookie('foo', 'bar');
    manager.setCookie('baz', 'qux');

    expect(manager.getCookies()).toMatchObject({
      foo: {value: 'bar'},
      baz: {value: 'qux'},
    });
  });

  it('removes cookies after they are set', () => {
    const manager = new BrowserCookieManager();

    manager.setCookie('foo', 'bar');

    expect(manager.getCookie('foo')).toBe('bar');

    manager.removeCookie('foo');

    expect(manager.getCookie('foo')).toBeUndefined();
  });
});
