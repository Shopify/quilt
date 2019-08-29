import {NetworkManager} from '../manager';

describe('NetworkManager', () => {
  describe('getHeader', () => {
    it('returns undefined when getting a header that does not exist', () => {
      const manager = new NetworkManager();

      expect(manager.getHeader('foo')).toBeUndefined();
    });

    it('returns headers from the provided dictionary', () => {
      const headers = {
        foo: 'bar',
      };
      const manager = new NetworkManager({headers});

      expect(manager.getHeader('foo')).toBe(headers.foo);
    });

    it('is case insensitive', () => {
      const headers = {
        foo: 'bar',
      };
      const manager = new NetworkManager({headers});

      expect(manager.getHeader('FoO')).toBe(headers.foo);
    });

    it('is case insensitive when headers are initialized in a different case', () => {
      const headers = {
        Foo: 'bar',
      };
      const manager = new NetworkManager({headers});

      expect(manager.getHeader('FoO')).toBe(headers.Foo);
    });
  });

  describe('cookies', () => {
    it('returns undefined when getting a cookie that does not exist', () => {
      const manager = new NetworkManager();

      expect(manager.getCookie('foo')).toBeUndefined();
    });

    it('returns cookies after they are set', () => {
      const manager = new NetworkManager();

      manager.setCookie('foo', 'bar');

      expect(manager.getCookie('foo')).toBe('bar');
    });
  });
});
