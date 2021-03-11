import faker from 'faker';

export function chooseNull() {
  return faker.random.boolean();
}

export function randomFromArray<T>(array: T[] | ReadonlyArray<T>) {
  return array[
    faker.random.number({min: 0, max: array.length - 1, precision: 1})
  ];
}
