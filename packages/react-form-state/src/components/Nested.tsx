import * as React from 'react';
import get from 'lodash/get';
import {memoize, bind} from 'lodash-decorators';

import {FieldDescriptor, FieldDescriptors} from '../types';
import {mapObject} from '../utilities';

interface Props<Fields> {
  field: FieldDescriptor<Fields>;
  children(fields: FieldDescriptors<Fields>): React.ReactNode;
}

export default class Nested<Fields> extends React.PureComponent<
  Props<Fields>,
  never
> {
  render() {
    const {
      field: {value, onBlur, initialValue, error},
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
          error: get(error, [fieldPath]),
          onChange: this.handleChange(fieldPath),
        };
      },
    );

    return children(innerFields);
  }

  @memoize
  @bind
  private handleChange<Key extends keyof Fields>(key: Key) {
    return (newValue: Fields[Key]) => {
      const {
        field: {value: existingItem, onChange},
      } = this.props;

      const newItem = {
        ...(existingItem as any),
        [key]: newValue,
      };

      onChange(newItem);
    };
  }
}
