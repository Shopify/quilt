import React, {InputHTMLAttributes} from 'react';
import {FieldState} from '../../types';

export interface Props {
  onRender?(): void;
  field: FieldState<string>;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class Input extends React.PureComponent<
  Props & InputHTMLAttributes<any>,
  never
> {
  render() {
    const {onRender, field} = this.props;

    onRender && onRender();

    return (
      <input
        // eslint-disable-next-line react/jsx-no-bind
        {...field}
      />
    );
  }
}
