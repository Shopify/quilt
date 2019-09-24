import DocumentCookie from '../document-cookie';

describe('DocumentCookie', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const cookie = new DocumentCookie();
      cookie.mock();

      expect(cookie.isMocked()).toBe(true);
      cookie.restore();
    });

    it('throws if it is already mocked', () => {
      const cookie = new DocumentCookie();
      cookie.mock();

      expect(() => {
        cookie.mock();
      }).toThrow();
      cookie.restore();
    });

    it('mocks cookies', () => {
      const cookie = new DocumentCookie();
      cookie.mock();

      const newCookie = 'foo=bar;';
      const anotherNewCookie = 'bar=baz';

      document.cookie = newCookie;
      document.cookie = anotherNewCookie;

      expect(document.cookie).toBe('foo=bar; bar=baz');
      cookie.restore();
    });

    it('sets initial cookies', () => {
      const cookie = new DocumentCookie();
      cookie.mock({foo: 'bar', bar: 'baz'});

      expect(document.cookie).toBe('foo=bar; bar=baz');
      cookie.restore();
    });
  });

  describe('reset', () => {
    it('removes all cookies', () => {
      const cookie = new DocumentCookie();
      cookie.mock();

      const newCookie = 'foo=bar;';
      const anotherNewCookie = 'bar=baz';

      document.cookie = newCookie;
      document.cookie = anotherNewCookie;

      expect(document.cookie).toBe('foo=bar; bar=baz');
      cookie.restore();
    });

    it('allows setting cookies after they have been reset', () => {
      const cookie = new DocumentCookie();
      cookie.mock();
      cookie.reset();

      const newCookie = 'foo=bar;';

      document.cookie = newCookie;

      expect(document.cookie).toBe('foo=bar');
      cookie.restore();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const cookie = new DocumentCookie();
      cookie.mock();
      cookie.restore();

      expect(cookie.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const cookie = new DocumentCookie();

      expect(() => {
        cookie.restore();
      }).toThrow();
    });
  });
});
