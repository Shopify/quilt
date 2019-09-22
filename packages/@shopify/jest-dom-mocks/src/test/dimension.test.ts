import Dimension from '../dimension';

describe('Dimension mocks', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const dimension = new Dimension();

      dimension.mock({
        scrollWidth: 200,
      });

      expect(dimension.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const dimension = new Dimension();

      dimension.mock({
        scrollWidth: 200,
      });

      expect(() => {
        dimension.mock({
          scrollWidth: 200,
        });
      }).toThrow(
        'Dimensions are already mocked, but you tried to mock them again.',
      );
    });

    it('throws if it no properties mocked', () => {
      const dimension = new Dimension();

      expect(() => dimension.mock({})).toThrow(
        'No dimensions provided for mocking',
      );
    });

    it('allows mocking all supported properties', () => {
      const dimension = new Dimension();

      expect(() => {
        dimension.mock({
          scrollWidth: 200,
          scrollHeight: 200,
          offsetWidth: 200,
          offsetHeight: 200,
        });
      }).not.toThrow();
    });

    it('mocks provided dimensions with a number', () => {
      const dimension = new Dimension();
      const testEl = document.createElement('div');

      dimension.mock({
        scrollWidth: 200,
      });

      expect(testEl.scrollWidth).toBe(200);
    });

    it('mocks provided dimensions with a discriminant function', () => {
      const dimension = new Dimension();

      const targetEl = document.createElement('div');
      const otherEl = document.createElement('div');

      targetEl.id = 'testId';

      dimension.mock({
        scrollWidth(element: HTMLElement) {
          return element.id === 'testId' ? 200 : 0;
        },
      });

      expect(targetEl.scrollWidth).toBe(200);
      expect(otherEl.scrollWidth).toBe(0);
    });
  });

  describe('restore', () => {
    it('unsets isMocked', () => {
      const dimension = new Dimension();
      dimension.mock({
        scrollWidth: 200,
      });
      dimension.restore();

      expect(dimension.isMocked()).toBe(false);
    });

    it('throws an error if it has not yet been mocked', () => {
      const dimension = new Dimension();

      expect(() => {
        dimension.restore();
      }).toThrow(
        "Dimensions haven't been mocked, but you are trying to restore them.",
      );
    });

    it('restores original dimension methods', () => {
      const dimension = new Dimension();
      const testEl = document.createElement('div');

      dimension.mock({
        scrollWidth: 200,
      });
      dimension.restore();

      expect(testEl.scrollWidth).not.toBe(200);
      expect(testEl.scrollWidth).toBeUndefined();
    });
  });
});
