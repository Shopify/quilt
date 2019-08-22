import * as React from 'react';

export interface Props {
  onChange?(value: string): void;
  onRender?(): void;
}

export default class Input extends React.PureComponent<
  Props & React.InputHTMLAttributes<any>,
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
