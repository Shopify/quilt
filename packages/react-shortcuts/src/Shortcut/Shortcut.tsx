import * as React from 'react';
import {contextTypes} from '../ShortcutProvider';
import Key, {ModifierKey} from '../keys';

export interface Props {
  ordered: Key[];
  held?: ModifierKey[];
  node?: HTMLElement | null;
  ignoreInput?: boolean;
  onMatch(matched: {ordered: Key[]; held?: ModifierKey[]}): void;
  allowDefault?: boolean;
}

export interface Subscription {
  unsubscribe(): void;
}

export default class Shortcut extends React.Component<Props, never> {
  static contextTypes = contextTypes;
  public data = {
    node: this.props.node,
    ordered: this.props.ordered,
    held: this.props.held,
    ignoreInput: this.props.ignoreInput || false,
    onMatch: this.props.onMatch,
    allowDefault: this.props.allowDefault,
  };
  public subscription!: Subscription;

  componentDidMount() {
    const {node} = this.data;

    if (node != null) {
      return;
    }

    const {shortcutManager} = this.context;
    this.subscription = shortcutManager.subscribe(this.data);
  }

  componentWillUnmount() {
    if (this.subscription == null) {
      return;
    }

    this.subscription.unsubscribe();
  }

  render() {
    return null;
  }
}
