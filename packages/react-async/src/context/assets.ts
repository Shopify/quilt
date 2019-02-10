import * as React from 'react';
import {EffectKind} from '@shopify/react-effect';

export const EFFECT_ID = Symbol('react-async');

export class AsyncAssetManager {
  readonly used = new Set<string>();

  readonly effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => this.used.clear(),
  };

  markAsUsed(id: string) {
    this.used.add(id);
  }
}

export const AsyncAssetContext = React.createContext<
  AsyncAssetManager | undefined
>(undefined);
