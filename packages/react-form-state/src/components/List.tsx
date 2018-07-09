import * as React from 'react';
import get from 'lodash/get';
import {memoize, bind} from 'lodash-decorators';

import {FieldDescriptor, FieldDescriptors} from '../types';
import {mapObject, replace} from '../utilities';

interface Props<Fields> {
  field: FieldDescriptor<Fields[]>;
  children(fields: FieldDescriptors<Fields>, index: number): React.ReactNode;
}

export default class List<Fields> extends React.PureComponent<
  Props<Fields>,
  never
> {
  render() {
    const {
      field: {value, initialValue, error, onBlur},
      children,
    } = this.props;

    return value.map((fieldValues, index) => {
      const innerFields: FieldDescriptors<Fields> = mapObject(
        fieldValues,
        (value, fieldPath) => {
          const initialFieldValue = get(initialValue, [index, fieldPath]);
          return {
            value,
            onBlur,
            name: `${name}.${index}.${fieldPath}`,
            initialValue: initialFieldValue,
            dirty: value !== initialFieldValue,
            error: get(error, [index, fieldPath]),
            onChange: this.handleChange(index, fieldPath),
          };
        },
      );

      return (
        // eslint-disable-next-line
        <React.Fragment key={index}>
          {children(innerFields, index)}
        </React.Fragment>
      );
    });
  }

  @memoize
  @bind
  private handleChange<Key extends keyof Fields>(index: number, key: Key) {
    return (newValue: Fields[Key]) => {
      const {
        field: {value, onChange},
      } = this.props;

      const existingItem = value[index];
      const newItem = {
        ...(existingItem as any),
        [key]: newValue,
      };

      onChange(replace(value, index, newItem));
    };
  }
}
