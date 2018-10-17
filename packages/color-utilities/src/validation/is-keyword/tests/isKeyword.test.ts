import isKeyword from '../isKeyword';

describe('isKeyword', () => {
  describe('non string data types', () => {
    it('returns false when the argument is of type boolean', () => {
      const booleanTest = isKeyword(true);
      expect(booleanTest).toBe(false);
    });

    it('returns false when the argument is of type undefined', () => {
      const undefinedTest = isKeyword(undefined);
      expect(undefinedTest).toBe(false);
    });

    it('returns false when the argument is of type number', () => {
      const numberTest = isKeyword(5);
      expect(numberTest).toBe(false);
    });

    it('returns false when the argument is of type object', () => {
      const plainObjectTest = isKeyword({});
      const nullTest = isKeyword(null);
      expect(plainObjectTest).toBe(false);
      expect(nullTest).toBe(false);
    });
  });

  it('returns true if the argument is a known color keyword', () => {
    const bool = isKeyword('navy');
    expect(bool).toBe(true);
  });

  it('returns false if the argument is not a known color keyword', () => {
    const bool = isKeyword('notacolor');
    expect(bool).toBe(false);
  });
});
