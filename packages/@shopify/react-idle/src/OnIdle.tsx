import {useIdleCallback} from './hooks';
import {UnsupportedBehavior} from './types';

interface Props {
  perform(): void;
  unsupportedBehavior?: UnsupportedBehavior;
}

export function OnIdle({perform, unsupportedBehavior}: Props) {
  useIdleCallback(perform, {unsupportedBehavior});
  return null;
}
