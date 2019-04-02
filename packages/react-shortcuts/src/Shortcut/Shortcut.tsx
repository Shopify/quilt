import useShortcut from './hooks';
import Key, {HeldKey} from '../keys';

export interface Props {
  ordered: Key[];
  held?: HeldKey;
  node?: HTMLElement | null;
  ignoreInput?: boolean;
  onMatch(matched: {ordered: Key[]; held?: HeldKey}): void;
  allowDefault?: boolean;
}

export default function Shortcut(props: Props) {
  const {ordered, onMatch, ...rest} = props;

  useShortcut(ordered, onMatch, {...rest});

  return null;
}
