import {useServerEffect} from './hook';
import {EffectKind} from './types';

interface Props {
  kind?: EffectKind;
  perform(): any;
}

export function Effect({kind, perform}: Props) {
  useServerEffect(perform, kind);
  return null;
}
