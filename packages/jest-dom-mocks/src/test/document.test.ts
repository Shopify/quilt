import Document from '../document';

describe('Document', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const event = new Document();
      event.mock();

      expect(event.isMocked()).toBe(true);
    });

    it('throw if it is already mocked', () => {
      const event = new Document();

      event.mock();

      expect(() => {
        event.mock();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const event = new Document();
      event.mock();
      event.restore();

      expect(event.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const event = new Document();

      expect(() => {
        event.restore();
      }).toThrow();
    });
  });
});
