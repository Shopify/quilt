import React from 'react';

import type {PrefetchManager} from './context/prefetch';
import {PrefetchContext} from './context/prefetch';

interface Props {
  manager: PrefetchManager;
  path: string | RegExp;
  render(url: URL): React.ReactNode;
}

class ConnectedPrefetchRoute extends React.Component<Props> {
  private unregister?: ReturnType<PrefetchManager['register']>;

  componentDidMount() {
    const {manager, path, render} = this.props;
    this.unregister = manager.register({
      path,
      render,
    });
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
  }

  render() {
    return null;
  }
}

export function PrefetchRoute(props: Omit<Props, 'manager'>) {
  return (
    <PrefetchContext.Consumer>
      {(manager) => (
        <ConnectedPrefetchRoute manager={manager} {...(props as any)} />
      )}
    </PrefetchContext.Consumer>
  );
}
