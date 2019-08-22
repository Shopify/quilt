import {NetworkManager} from '../manager';

describe('NetworkManager', () => {
  describe('getHeader', () => {
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
  });
});
