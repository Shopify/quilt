import * as React from 'react';
import {Omit} from '@shopify/useful-types';
import {EffectContext, EffectManager} from './context';
import {EffectKind} from './types';

interface Props {
  kind?: EffectKind;
  manager?: EffectManager;
  perform(): any;
}

class ConnectedEffect extends React.PureComponent<Props> {
  render() {
    this.perform();

    return this.props.children || null;
  }

  private perform() {
    const {kind, manager, perform} = this.props;

    if (manager == null || (kind != null && !manager.shouldPerform(kind))) {
      return;
    }

    manager.add(perform(), kind);
  }
}

export default function Effect(props: Omit<Props, 'manager'>) {
  if (typeof window !== 'undefined') {
    return null;
  }

  return (
    <EffectContext.Consumer>
      {manager => <ConnectedEffect manager={manager} {...props} />}
    </EffectContext.Consumer>
  );
}
