import Key, {HeldKey} from '../keys';

import useShortcut from './hooks';

export interface Props {
  ordered: Key[];
  held?: HeldKey;
  node?: HTMLElement | null;
  disabled?: boolean;
  allowDefault?: boolean;
  onMatch(matched: {ordered: Key[]; held?: HeldKey}): void;
  ignoreInput?(): void;
}

export default function Shortcut(props: Props) {
  const {ordered, onMatch, ...rest} = props;

  useShortcut(ordered, onMatch, {...rest});

  return null;
}
