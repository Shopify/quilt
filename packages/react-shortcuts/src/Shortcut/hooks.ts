import React from 'react';

import {ShortcutContext} from '../ShortcutProvider';
import Key, {HeldKey} from '../keys';

const DEFAULT_IGNORED_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'] as const;

export type DefaultIgnoredTag = typeof DEFAULT_IGNORED_TAGS[number];

export interface Subscription {
  unsubscribe(): void;
}

export interface Options {
  held?: HeldKey;
  node?: HTMLElement | null;
  ignoreInput?: boolean;
  acceptedDefaultIgnoredTags?: DefaultIgnoredTag[];
  allowDefault?: boolean;
}

export default function useShortcut(
  ordered: Key[],
  onMatch: (matched: {ordered: Key[]; held?: HeldKey}) => void,
  options: Options = {},
) {
  const shortcutManager = React.useContext(ShortcutContext);
  const subscription = React.useRef<Subscription | null>(null);
  const {
    node,
    held,
    ignoreInput,
    acceptedDefaultIgnoredTags,
    allowDefault,
  } = options;

  React.useEffect(() => {
    if (shortcutManager == null) {
      return;
    }

    subscription.current = shortcutManager.subscribe({
      onMatch,
      ordered,
      node,
      held,
      ignoreInput: ignoreInput || false,
      ignoredTags: getIgnoredTags(acceptedDefaultIgnoredTags),
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
    held,
    ignoreInput,
    acceptedDefaultIgnoredTags,
    allowDefault,
    shortcutManager,
    onMatch,
  ]);
}

function getIgnoredTags(acceptedDefaultIgnoredTags?: DefaultIgnoredTag[]) {
  if (!acceptedDefaultIgnoredTags?.length) {
    return (DEFAULT_IGNORED_TAGS as unknown) as DefaultIgnoredTag[];
  }

  return DEFAULT_IGNORED_TAGS.filter(
    (tag) => !acceptedDefaultIgnoredTags.includes(tag),
  );
}
