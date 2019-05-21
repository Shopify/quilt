import * as React from 'react';
import {EffectKind} from '@shopify/react-effect';
import {PreloadPriority} from '../shared';

export const EFFECT_ID = Symbol('react-async');

export class AsyncAssetManager {
  readonly used = new Set<string>();

  readonly effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => {
      this.used.clear();
      this.preload[PreloadPriority.CurrentPage].clear();
      this.preload[PreloadPriority.NextPage].clear();
    },
  };

  private readonly preload = {
    [PreloadPriority.CurrentPage]: new Set<string>(),
    [PreloadPriority.NextPage]: new Set<string>(),
  };

  preloaded(priority: PreloadPriority) {
    return this.preload[priority] || new Set();
  }

  markAsUsed(id: string) {
    this.used.add(id);
  }

  markAsPreload(id: string, priority: PreloadPriority) {
    if (
      priority === PreloadPriority.CurrentPage ||
      priority === PreloadPriority.NextPage
    ) {
      this.preload[priority].add(id);
    }
  }
}

export const AsyncAssetContext = React.createContext<
  AsyncAssetManager | undefined
>(undefined);
