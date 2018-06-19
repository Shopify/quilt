import * as React from 'react';
import {func, shape} from 'prop-types';

export interface Props {
  report(moduleName: string): number;
}

export class CaptureChunks extends React.Component<Props, never> {
  static childContextTypes = {
    loadable: shape({
      report: func.isRequired,
    }).isRequired,
  };

  getChildContext() {
    return {
      loadable: {
        report: this.props.report,
      },
    };
  }

  render() {
    const {children} = this.props;
    return React.Children.only(children);
  }
}
