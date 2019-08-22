import faker from 'faker';
import {push, replace, remove} from '../utilities';

describe('array-utilities', () => {
  describe('push', () => {
    it('returns array with new member appended', () => {
      const array = [faker.address.latitude()];

      const newItem = faker.address.latitude();
      const newArray = push(array, newItem);

      expect(newArray).toStrictEqual(array.concat([newItem]));
    });

    it('does not mutate original array', () => {
      const array = [faker.address.latitude()];
      const newItem = faker.address.latitude();

      const newArray = push(array, newItem);

      expect(newArray).not.toBe(array);
      expect(array).not.toEqual(array.concat([newItem]));
    });
  });

  describe('replace', () => {
    it('returns array with new value replacing given index', () => {
      const array = [
        faker.address.latitude(),
        faker.address.latitude(),
        faker.address.latitude(),
      ];

      const newItem = faker.address.latitude();
      const newArray = replace(array, 1, newItem);

      expect(newArray).toStrictEqual([array[0], newItem, array[2]]);
    });

    it('does not mutate original array', () => {
      const array = [faker.address.latitude()];
      const newItem = faker.address.latitude();

      const newArray = replace(array, 0, newItem);

      expect(newArray).not.toBe(array);
      expect(array).not.toEqual([newItem]);
    });
  });

  describe('remove', () => {
    it('returns array with value at given index removed', () => {
      const array = [
        faker.address.latitude(),
        faker.address.latitude(),
        faker.address.latitude(),
      ];

      const newArray = remove(array, 1);

      expect(newArray).toStrictEqual([array[0], array[2]]);
    });

    it('does not mutate original array', () => {
      const array = [faker.address.latitude()];

      const newArray = remove(array, 0);

      expect(newArray).not.toBe(array);
      expect(array).not.toEqual([]);
    });
  });
});
