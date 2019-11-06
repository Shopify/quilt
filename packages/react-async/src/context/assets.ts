import React from 'react';
import {EffectKind} from '@shopify/react-effect';

import {AssetTiming} from '../types';

export interface AssetSelector {
  id: string;
  styles: boolean;
  scripts: boolean;
}

interface AssetOptions {
  styles: AssetTiming;
  scripts: AssetTiming;
}

export const EFFECT_ID = Symbol('react-async');

export class AsyncAssetManager {
  readonly effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => {
      this.assets.clear();
    },
  };

  private assets = new Map<string, AssetOptions>();

  used(timing: AssetTiming | AssetTiming[] = AssetTiming.Immediate) {
    const timingArray = Array.isArray(timing) ? timing : [timing];

    const assets: AssetSelector[] = [];

    for (const [asset, {scripts, styles}] of this.assets) {
      const scriptsMatch = timingArray.includes(scripts);
      const stylesMatch = timingArray.includes(styles);

      if (stylesMatch || scriptsMatch) {
        assets.push({id: asset, scripts: scriptsMatch, styles: stylesMatch});
      }
    }

    return assets;
  }

  markAsUsed(
    id: string,
    timing:
      | AssetTiming
      | {scripts?: AssetTiming; styles?: AssetTiming} = AssetTiming.Immediate,
  ) {
    const current = this.assets.get(id);
    const scripts = typeof timing === 'object' ? timing.scripts : timing;
    const styles = typeof timing === 'object' ? timing.styles : timing;

    if (current == null) {
      this.assets.set(id, {
        scripts: scripts || AssetTiming.Immediate,
        styles: styles || AssetTiming.Immediate,
      });
    } else {
      this.assets.set(id, {
        // the AssetTiming enum has values where the smallest value is
        // the lowest importance load, and the highest value is for assets
        // needed immediately. So, when a new asset comes in that has
        // already been recorded, we can take the maximum value to
        // keep only the highest priority timing for the asset.
        scripts: Math.max(scripts || current.scripts, current.styles),
        styles: Math.max(styles || current.styles, current.styles),
      });
    }
  }
}

export const AsyncAssetContext = React.createContext<AsyncAssetManager | null>(
  null,
);
