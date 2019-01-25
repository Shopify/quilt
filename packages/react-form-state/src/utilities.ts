export function mapObject<Input, Output>(
  input: Input,
  mapper: (value: any, key: keyof Input) => any,
) {
  return Object.entries(input).reduce((accumulator: any, [key, value]) => {
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

export function set<InputType extends Object>(
  rootObject: InputType,
  path: string[],
  value: any,
) {
  if (path.length === 0) {
    return rootObject;
  } else if (path.length === 1) {
    return {
      ...(rootObject as any),
      [path[0]]: value,
    };
  } else {
    const [current, ...rest] = path;
    return {
      ...(rootObject as any),
      [current]: set(rootObject[current], rest, value),
    } as InputType;
  }
}

export function isEqual(value: any, baseline: any) {
  if (value === baseline) {
    return true;
  }
  if (typeof value !== typeof baseline) {
    return false;
  }
  if (Array.isArray(value)) {
    if (!Array.isArray(baseline)) {
      return false;
    }
    if (value.length !== baseline.length) {
      return false;
    }
    for (let iter = 0; iter < value.length; iter++) {
      if (!isEqual(value[iter], baseline[iter])) {
        return false;
      }
    }
    return true;
  }
  if (typeof value === 'object') {
    if (value === null) {
      return baseline === null;
    }
    if (baseline === null) {
      return false;
    }
    const keysInValue = Object.keys(value);
    const keysInBaseline = Object.keys(baseline);
    if (!isEqual(keysInValue, keysInBaseline)) {
      return false;
    }
    for (const key of keysInValue) {
      if (!isEqual(value[key], baseline[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
