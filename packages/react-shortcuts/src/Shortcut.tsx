import * as React from 'react';
import {Consumer, WithShortcutManagerProps} from './ShortcutProvider';
import {Subscription} from './ShortcutManager';
import Key, {ModifierKey} from './keys';

export interface Props {
  ordered: Key[];
  held?: ModifierKey[];
  node?: HTMLElement | null;
  ignoreInput?: boolean;
  onMatch(matched: {ordered: Key[]; held?: ModifierKey[]}): void;
  allowDefault?: boolean;
}

type ComposedProps = Props & WithShortcutManagerProps;

class Shortcut extends React.Component<ComposedProps, never> {
  subscription: Subscription;

  componentDidMount() {
    const {
      node,
      ordered,
      held,
      ignoreInput,
      onMatch,
      allowDefault,
      shortcutManager,
    } = this.props;

    this.subscription = shortcutManager.subscribe({
      node,
      ordered,
      held,
      ignoreInput: ignoreInput || false,
      onMatch,
      allowDefault: allowDefault || false,
    });
  }

  componentWillUnmount() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}

export default React.forwardRef<any, Props>((props, ref) => (
  <Consumer>
    {shortcutManager => (
      <Shortcut {...props} shortcutManager={shortcutManager} ref={ref} />
    )}
  </Consumer>
));
