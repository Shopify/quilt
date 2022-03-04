import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import {isObject} from 'lodash';
import isFunction from 'lodash/isFunction';

import {DeepPartial, DeepOmitOptional, Thunk} from './types';

function getDefaultValues(defaults, arg) {
  const unwrappedDefaults = isFunction(defaults) ? defaults(arg) : defaults;

  if (Array.isArray(unwrappedDefaults)) {
    return merge([], unwrappedDefaults);
  } else if (isObject(unwrappedDefaults)) {
    return merge({}, unwrappedDefaults);
  }
  return unwrappedDefaults;
}

export function mergeMocks<Defaults, Input, Arg>(
  defaults: Defaults,
  input: Input,
  arg?: Arg,
) {
  return mergeWith(
    getDefaultValues(defaults, arg),
    input,
    (defaultValue, inputValue) => {
      if (Array.isArray(inputValue) && Array.isArray(defaultValue)) {
        if (inputValue.length === 0) {
          return inputValue;
        }
        return merge(defaultValue, inputValue);
      }
    },
  );
}

export function createMockFactory<T, A = never>(
  defaults: Thunk<DeepOmitOptional<T>, A>,
) {
  return function createMock<ReturnType extends T>(
    input?: DeepPartial<ReturnType>,
  ): ReturnType {
    return mergeMocks(defaults, input, input);
  };
}
