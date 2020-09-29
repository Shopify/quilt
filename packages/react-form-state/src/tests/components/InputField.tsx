import React from 'react';

import {FieldState} from '../../types';

export interface Props {
  onRender?(): void;
  field: FieldState<string>;
}

export default class Input extends React.PureComponent<
  Props & React.InputHTMLAttributes<any>,
  never
> {
  render() {
    const {onRender, field} = this.props;

    if (onRender) {
      onRender();
    }

    return <input {...field} />;
  }
}
