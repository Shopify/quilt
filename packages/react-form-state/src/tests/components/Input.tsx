import React, {InputHTMLAttributes} from 'react';

export interface Props {
  onChange?(value: string): void;
  onRender?(): void;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class Input extends React.PureComponent<
  Props & InputHTMLAttributes<any>,
  never
> {
  render() {
    const {onChange, onRender, ...inputProps} = this.props;

    onRender && onRender();

    return (
      <input
        // eslint-disable-next-line react/jsx-no-bind
        onChange={({currentTarget}) => {
          onChange && onChange(currentTarget.value);
        }}
        {...inputProps}
      />
    );
  }
}
