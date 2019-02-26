import * as React from 'react';

import {FieldDescriptor, FieldDescriptors, ValueMapper} from '../types';
import {mapObject, replace} from '../utilities';

interface Props<Fields> {
  field: FieldDescriptor<Fields[]>;
  children(fields: FieldDescriptors<Fields>, index: number): React.ReactNode;
  getChildKey?(item: Fields): string;
}

export default class List<Fields> extends React.Component<
  Props<Fields>,
  never
> {
  private changeHandlers = new Map<string, {(newValue: any): void}>();

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
      field: {value, initialValue, error, name, onBlur},
      getChildKey,
      children,
    } = this.props;

    return value.map((fieldValues, index) => {
      const innerFields: FieldDescriptors<Fields> = mapObject(
        fieldValues,
        (value, fieldPath) => {
          const initialFieldValue =
            initialValue[index] && initialValue[index][fieldPath];
          return {
            value,
            onBlur,
            name: `${name}.${index}.${fieldPath}`,
            initialValue: initialFieldValue,
            dirty: value !== initialFieldValue,
            error: error && error[index] && error[index][fieldPath],
            onChange: this.handleChange({index, key: fieldPath}),
          };
        },
      );

      const key = getChildKey ? getChildKey(fieldValues) : index;

      return (
        // eslint-disable-next-line
        <React.Fragment key={key}>
          {children(innerFields, index)}
        </React.Fragment>
      );
    });
  }

  private handleChange = <Key extends keyof Fields>({
    index,
    key,
  }: {
    index: number;
    key: Key;
  }) => {
    const hashKey = `${index}:${key}`;
    if (this.changeHandlers.has(hashKey)) {
      return this.changeHandlers.get(hashKey);
    }
    const handler = (newValue: Fields[Key] | ValueMapper<Fields[Key]>) => {
      const {
        field: {onChange},
      } = this.props;

      onChange(value => {
        const existingItem = value[index];
        const newItem = {
          ...(existingItem as any),
          [key]:
            typeof newValue === 'function'
              ? (newValue as ValueMapper<Fields[Key]>)(value[index][key])
              : newValue,
        };
        return replace(value, index, newItem);
      });
    };
    this.changeHandlers.set(hashKey, handler);
    return handler;
  };
}
