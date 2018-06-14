export function chooseNull() {
  return Math.random() < 0.5;
}

export function randomFromArray<T>(array: T[] | ReadonlyArray<T>) {
  return array[Math.floor(Math.random() * array.length)];
}
