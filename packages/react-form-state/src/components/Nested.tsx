import * as React from 'react';
import get from 'lodash/get';
import {memoize, bind} from 'lodash-decorators';

import {FieldDescriptor, FieldDescriptors, ValueMapper} from '../types';
import {mapObject} from '../utilities';

interface Props<Fields> {
  field: FieldDescriptor<Fields>;
  children(fields: FieldDescriptors<Fields>): React.ReactNode;
}

export default class Nested<Fields> extends React.Component<
  Props<Fields>,
  never
> {
  shouldComponentUpdate(nextProps) {
    const {
      field: {
        value: nextValue,
        error: nextError,
        initialValue: nextInitialValue,
      },
    } = nextProps;
    const {
      field: {value, error, initialValue},
    } = this.props;

    return (
      nextValue !== value ||
      nextError !== error ||
      nextInitialValue !== initialValue
    );
  }

  render() {
    const {
      field: {name, value, onBlur, initialValue, error},
      children,
    } = this.props;

    const innerFields: FieldDescriptors<Fields> = mapObject(
      value,
      (value, fieldPath) => {
        const initialFieldValue = initialValue[fieldPath];
        return {
          value,
          onBlur,
          name: `${name}.${fieldPath}`,
          initialValue: initialFieldValue,
          dirty: value !== initialFieldValue,
          error: get(error, fieldPath),
          onChange: this.handleChange(fieldPath),
        };
      },
    );

    return children(innerFields);
  }

  @memoize()
  @bind()
  private handleChange<Key extends keyof Fields>(key: Key) {
    return (newValue: Fields[Key] | ValueMapper<Fields>) => {
      const {
        field: {onChange},
      } = this.props;

      onChange(value => {
        return {
          ...(value as any),
          [key]:
            typeof newValue === 'function'
              ? newValue(value[key as string])
              : newValue,
        };
      });
    };
  }
}
