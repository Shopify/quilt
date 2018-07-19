export function deepEqual(first: any, second: any, maxDepth = 20, depth = 0) {
  const newDepth = depth + 1;

  if (newDepth > maxDepth) {
    throw new Error('Maximum comparison depth reached.');
  }

  if (first === second) {
    return true;
  }

  if (typeof first !== typeof second) {
    return false;
  }

  if (first === null || second === null) {
    return false;
  }

  if (Array.isArray(first)) {
    return arrayEqual(first, second, depth, maxDepth);
  }

  if (typeof first === 'object') {
    return objectEqual(first, second, depth, maxDepth);
  }

  return first.valueOf() === second.valueOf();
}

function arrayEqual(
  first: any[],
  second: any[],
  depth: number,
  maxDepth: number,
) {
  if (first.length !== second.length) return false;

  return first.every((valueOfFirst, index) =>
    deepEqual(valueOfFirst, second[index], depth, maxDepth),
  );
}

function objectEqual(first: any, second: any, depth, maxDepth) {
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  return firstKeys.every(
    key =>
      Object.prototype.hasOwnProperty.call(second, key) &&
      !deepEqual(first[key], second[key], depth, maxDepth),
  );
}

export function mapObject<Input, Output>(
  input: Input,
  mapper: (value: any, key: keyof Input) => any,
) {
  return Object.keys(input)
    .map(key => [key, input[key]])
    .reduce((accumulator: any, [key, value]) => {
      accumulator[key] = mapper(value, key as keyof Input);
      return accumulator;
    }, {}) as Output;
}

export function push<T>(array: T[], ...values: T[]) {
  return array.concat(values);
}

export function remove<T>(array: T[], targetIndex: number) {
  return array.filter((_, index) => index !== targetIndex);
}

export function replace<T>(array: T[], targetIndex: number, newValue: T) {
  return array.map((value, index) => {
    if (index !== targetIndex) {
      return value;
    }

    return newValue;
  });
}
