import {faker} from '@faker-js/faker/locale/en';

export function chooseNull() {
  return faker.datatype.boolean();
}

export function randomFromArray<T>(array: T[] | ReadonlyArray<T>) {
  return array[faker.number.int({min: 0, max: array.length - 1})];
}
