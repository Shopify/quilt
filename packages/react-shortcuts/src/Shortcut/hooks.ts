import React from 'react';

import {ShortcutContext} from '../ShortcutProvider';
import Key, {HeldKey} from '../keys';

export interface Subscription {
  unsubscribe(): void;
}

export interface Options {
  node?: HTMLElement | null;
  held?: HeldKey;
  disabled?: boolean;
  allowDefault?: boolean;
  ignoreInput?(): void;
}

export default function useShortcut(
  ordered: Key[],
  onMatch: (matched: {ordered: Key[]; held?: HeldKey}) => void,
  options: Options = {},
) {
  const shortcutManager = React.useContext(ShortcutContext);
  const subscription = React.useRef<Subscription | null>(null);
  const {node, held, disabled, allowDefault, ignoreInput} = options;

  React.useEffect(() => {
    if (node != null) {
      return;
    }

    if (shortcutManager == null) {
      return;
    }

    subscription.current = shortcutManager.subscribe({
      onMatch,
      ordered,
      node,
      held,
      disabled: disabled || false,
      allowDefault: allowDefault || false,
      ignoreInput: ignoreInput || undefined,
    });

    return () => {
      if (subscription.current == null) {
        return;
      }

      subscription.current.unsubscribe();
    };
  }, [
    node,
    ordered,
    held,
    disabled,
    allowDefault,
    onMatch,
    ignoreInput,
    shortcutManager,
  ]);
}
