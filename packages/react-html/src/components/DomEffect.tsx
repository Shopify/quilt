import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Omit} from '@shopify/useful-types';
import {Context} from '../context';
import Manager from '../manager';

interface RemoveCallback {
  (): void;
}

interface Props {
  manager: Manager;
  perform(manager: Manager): RemoveCallback;
}

class ConnectedDomEffect extends React.Component<Props> {
  private remove?: RemoveCallback;

  componentDidMount() {
    this.remove = this.props.perform(this.props.manager);
  }

  componentWillUnmount() {
    if (this.remove) {
      this.remove();
    }
  }

  render() {
    const {manager, perform} = this.props;
    return <Effect kind={manager.effect} perform={() => perform(manager)} />;
  }
}

export default function DomEffect(props: Omit<Props, 'manager'>) {
  return (
    <Context.Consumer>
      {manager => <ConnectedDomEffect manager={manager} {...props} />}
    </Context.Consumer>
  );
}
