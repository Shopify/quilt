import arrayIsEqual from '../arrayIsEqual';

describe('arrayIsEqual', () => {
  it('returns false when arrays have different lengths', () => {
    const arrOne = [1, 2, 3];
    const arrTwo = [1, 2, 3, 4];
    const areArrEqual = arrayIsEqual(arrOne, arrTwo);
    expect(areArrEqual).toBe(false);
  });

  it('returns true when the provided arrays are the same', () => {
    const arrOne = [1, 2, 3];
    const arrTwo = [1, 2, 3];
    const areArrEqual = arrayIsEqual(arrOne, arrTwo);
    expect(areArrEqual).toBe(true);
  });

  it('returns false when the provided arrays are different', () => {
    const arrOne = [1, 2, 3];
    const arrTwo = [2, 3, 4];
    const areArrEqual = arrayIsEqual(arrOne, arrTwo);
    expect(areArrEqual).toBe(false);
  });
});
