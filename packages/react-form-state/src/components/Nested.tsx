import * as React from 'react';
import get from 'lodash/get';
import {memoize, bind} from 'lodash-decorators';

import {Field, Fields} from '../types';
import {mapObject} from '../utilities';

interface Props<FieldMap> {
  field: Field<FieldMap>;
  children(fields: Fields<FieldMap>): React.ReactNode;
}

export default class Nested<FieldMap> extends React.PureComponent<
  Props<FieldMap>,
  never
> {
  render() {
    const {
      field: {name, value, onBlur, initialValue, error},
      children,
    } = this.props;

    const innerFields: Fields<FieldMap> = mapObject(
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
  private handleChange<Key extends keyof FieldMap>(key: Key) {
    return (newValue: FieldMap[Key]) => {
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
