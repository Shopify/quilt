import {CookieManager} from '../manager';

describe('cookies', () => {
  it('returns undefined when getting a cookie that does not exist', () => {
    const manager = new CookieManager();

    expect(manager.getCookie('foo')).toBeUndefined();
  });

  it('sets initial cookies when set as a string', () => {
    const manager = new CookieManager('foo=bar');

    expect(manager.getCookie('foo')).toBe('bar');
  });

  it('sets initial cookies when manually set as an object', () => {
    const manager = new CookieManager({foo: 'bar'});

    expect(manager.getCookie('foo')).toBe('bar');
  });

  it('returns cookies after they are set', () => {
    const manager = new CookieManager();

    manager.setCookie('foo', 'bar');

    expect(manager.getCookie('foo')).toBe('bar');
  });

  it('returns all cookies', () => {
    const manager = new CookieManager();

    manager.setCookie('foo', 'bar');
    manager.setCookie('baz', 'qux');

    expect(manager.getCookies()).toMatchObject({
      foo: {value: 'bar'},
      baz: {value: 'qux'},
    });
  });

  it('removes cookies after they are set', () => {
    const manager = new CookieManager({foo: 'bar'});

    expect(manager.getCookie('foo')).toBe('bar');

    manager.removeCookie('foo');

    expect(manager.getCookie('foo')).toBeUndefined();
  });
});
