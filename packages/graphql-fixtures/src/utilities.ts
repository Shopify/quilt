import faker from '@faker-js/faker';

export function chooseNull() {
  return faker.datatype.boolean();
}

export function randomFromArray<T>(array: T[] | ReadonlyArray<T>) {
  return array[
    faker.datatype.number({min: 0, max: array.length - 1, precision: 1})
  ];
}
