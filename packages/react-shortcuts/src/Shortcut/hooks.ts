import React from 'react';
import {ShortcutContext} from '../ShortcutProvider';
import Key, {HeldKey} from '../keys';

export interface Subscription {
  unsubscribe(): void;
}

export interface Options {
  held?: HeldKey;
  node?: HTMLElement | null;
  ignoreInput?: boolean;
  allowDefault?: boolean;
}

export default function useShortcut(
  ordered: Key[],
  onMatch: (matched: {ordered: Key[]; held?: HeldKey}) => void,
  options: Options = {},
) {
  const shortcutManager = React.useContext(ShortcutContext);
  const subscription = React.useRef<Subscription | null>(null);
  const {node, held, ignoreInput, allowDefault} = options;

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
      ignoreInput: ignoreInput || false,
      allowDefault: allowDefault || false,
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
    onMatch,
    held,
    ignoreInput,
    allowDefault,
    shortcutManager,
  ]);
}
