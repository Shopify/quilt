import * as React from 'react';
import * as PropTypes from 'prop-types';

import Manager from './manager';

export const contextTypes = {
  i18nManager: PropTypes.instanceOf(Manager),
};

export interface Context {
  i18nManager: Manager;
}

export interface Props {
  manager: Manager;
}

export default class Provider extends React.PureComponent<Props, never> {
  static childContextTypes = contextTypes;

  getChildContext(): Context {
    return {i18nManager: this.props.manager};
  }

  render() {
    return this.props.children;
  }
}
