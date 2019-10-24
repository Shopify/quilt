import React from 'react';
import {Omit} from '@shopify/useful-types';

export interface Props {
  onChange?(value: string): void;
  onRender?(): void;
}

export default class Input extends React.PureComponent<
  Props & Omit<React.InputHTMLAttributes<any>, 'onChange'>,
  never
> {
  render() {
    const {onChange, onRender, ...inputProps} = this.props;

    if (onRender) {
      onRender();
    }

    return (
      <input
        onChange={({currentTarget}) => {
          if (onChange) {
            onChange(currentTarget.value);
          }
        }}
        {...inputProps}
      />
    );
  }
}
