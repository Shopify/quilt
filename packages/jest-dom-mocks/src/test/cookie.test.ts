import DocumentCookie from '../document-cookie';

describe('DocumentCookie', () => {
  describe('mock', () => {
    // it('sets isMocked()', () => {
    //   const cookie = new DocumentCookie();
    //   cookie.mock();

    //   expect(cookie.isMocked()).toBe(true);
    // });

    // it('throws if it is already mocked', () => {
    //   const cookie = new DocumentCookie();
    //   cookie.mock();

    //   expect(() => {
    //     cookie.mock();
    //   }).toThrow();
    // });

    it('mocks cookies', () => {
      const newCookie = 'foo=bar;';
      const anotherNewCookie = 'bar=baz';

      document.cookie = newCookie;
      document.cookie = anotherNewCookie;

      console.log(document.cookie);
      expect(document.cookie).toBe('foo=bar; bar=baz');
    });
  });

  // describe('restore', () => {
  //   it('sets isMocked', () => {
  //     const cookie = new DocumentCookie();
  //     cookie.mock();
  //     cookie.restore();

  //     expect(cookie.isMocked()).toBe(false);
  //   });

  //   it('throws if it has not yet been mocked', () => {
  //     const cookie = new DocumentCookie();

  //     expect(() => {
  //       cookie.restore();
  //     }).toThrow();
  //   });
  // });
});
