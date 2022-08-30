import {DeepPartial} from '@shopify/useful-types';
import merge from 'lodash/merge';
import clone from 'lodash/clone';
import mergeWith from 'lodash/mergeWith';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';

import {ThunkDefaults, ReturnedType} from './types';

export function createMockFactory<T>(defaults: ThunkDefaults<T>) {
  return function createMock<ReturnType extends ReturnedType<T>>(
    input?: DeepPartial<T>,
  ): ReturnType {
    let unthunkDefaults = clone(
      isFunction(defaults) ? defaults(input) : defaults,
    );

    // create new instances of defaults on each invocation
    if (Array.isArray(unthunkDefaults)) {
      unthunkDefaults = merge([], unthunkDefaults);
    } else if (isObject(unthunkDefaults)) {
      unthunkDefaults = merge({}, unthunkDefaults);
    }

    return mergeWith(
      // eslint-disable-next-line no-warning-comments
      // TODO: we should be able to use DeepOmitOptional<T> & DeepPartial<T>
      // but somehow their union does not resolve back to T. we need to make them cancel each other out somehow
      unthunkDefaults as any,
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
  };
}
