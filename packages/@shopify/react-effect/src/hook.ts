import {useContext} from 'react';

import {EffectContext} from './context';
import {EffectKind} from './types';

export function useServerEffect(perform: () => any, kind?: EffectKind) {
  const manager = useContext(EffectContext);

  if (manager == null || (kind != null && !manager.shouldPerform(kind))) {
    return;
  }

  manager.add(perform(), kind);
}
