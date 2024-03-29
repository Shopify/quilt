import {faker} from '@faker-js/faker/locale/en';

import {push, replace, remove} from '../utilities';

describe('array-utilities', () => {
  describe('push', () => {
    it('returns array with new member appended', () => {
      const array = [faker.location.latitude()];

      const newItem = faker.location.latitude();
      const newArray = push(array, newItem);

      expect(newArray).toStrictEqual(array.concat([newItem]));
    });

    it('does not mutate original array', () => {
      const array = [faker.location.latitude()];
      const newItem = faker.location.latitude();

      const newArray = push(array, newItem);

      expect(newArray).not.toBe(array);
      expect(array).not.toStrictEqual(array.concat([newItem]));
    });
  });

  describe('replace', () => {
    it('returns array with new value replacing given index', () => {
      const array = [
        faker.location.latitude(),
        faker.location.latitude(),
        faker.location.latitude(),
      ];

      const newItem = faker.location.latitude();
      const newArray = replace(array, 1, newItem);

      expect(newArray).toStrictEqual([array[0], newItem, array[2]]);
    });

    it('does not mutate original array', () => {
      const array = [faker.location.latitude()];
      const newItem = faker.location.latitude();

      const newArray = replace(array, 0, newItem);

      expect(newArray).not.toBe(array);
      expect(array).not.toStrictEqual([newItem]);
    });
  });

  describe('remove', () => {
    it('returns array with value at given index removed', () => {
      const array = [
        faker.location.latitude(),
        faker.location.latitude(),
        faker.location.latitude(),
      ];

      const newArray = remove(array, 1);

      expect(newArray).toStrictEqual([array[0], array[2]]);
    });

    it('does not mutate original array', () => {
      const array = [faker.location.latitude()];

      const newArray = remove(array, 0);

      expect(newArray).not.toBe(array);
      expect(array).not.toStrictEqual([]);
    });
  });
});
