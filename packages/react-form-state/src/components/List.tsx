import * as React from 'react';
import get from 'lodash/get';
import {memoize, bind} from 'lodash-decorators';

import {Field, Fields} from '../types';
import {mapObject, replace} from '../utilities';

interface Props<FieldMap> {
  field: Field<FieldMap[]>;
  children(fields: Fields<FieldMap>, index: number): React.ReactNode;
}

export default class List<FieldMap> extends React.PureComponent<
  Props<FieldMap>,
  never
> {
  render() {
    const {
      field: {value, initialValue, error, onBlur},
      children,
    } = this.props;

    return value.map((fieldValues, index) => {
      const innerFields: Fields<FieldMap> = mapObject(
        fieldValues,
        (value, key: keyof FieldMap) => {
          const initialFieldValue = get(initialValue, [index, key]);
          return {
            value,
            onBlur,
            name: `${name}.${index}.${key}`,
            initialValue: initialFieldValue,
            dirty: value !== initialFieldValue,
            error: get(error, [index, key]),
            onChange: this.handleChange({index, key}),
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

  @memoize()
  @bind()
  private handleChange<Key extends keyof FieldMap>({
    index,
    key,
  }: {
    index: number;
    key: Key;
  }) {
    return (newValue: FieldMap[Key]) => {
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
