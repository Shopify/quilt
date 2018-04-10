import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';

export interface Props {
  onToggle: (...args: any[]) => any;
  deferred?: boolean;
}

export interface State {
  active: boolean;
}

const DEFERRED_TIMEOUT = 100;

export class Toggle extends React.PureComponent<Props, State> {
  state = {
    active: true,
  };

  render() {
    const {active} = this.state;

    const statusMarkup = active ? 'active' : 'inactive';

    return (
      <button type="button" onClick={this.handleClick}>
        {statusMarkup}
      </button>
    );
  }

  toggleActive() {
    this.setState(
      ({active}) => ({
        active: !active,
      }),
      this.props.onToggle,
    );
  }

  @autobind
  handleClick() {
    if (this.props.deferred) {
      return new Promise(resolve => {
        setTimeout(() => {
          this.toggleActive();
          resolve();
        }, DEFERRED_TIMEOUT);
      });
    }
    this.toggleActive();
    return Promise.resolve();
  }
}
