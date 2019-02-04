import * as React from 'react';
import {EffectKind} from './types';

interface Options {
  include?: symbol[] | boolean;
}

export class EffectManager {
  private include: symbol[] | boolean;
  private effects: Promise<any>[] = [];
  private kinds = new Set<EffectKind>();

  get finished() {
    return this.effects.length === 0;
  }

  constructor({include = true}: Options = {}) {
    this.include = include;
  }

  add(effect: any, kind?: EffectKind) {
    if (kind != null) {
      this.kinds.add(kind);
    }

    if (effect == null || !('then' in effect)) {
      return;
    }

    this.effects.push(effect);
  }

  async resolve() {
    await Promise.all(this.effects);
  }

  betweenEachPass() {
    for (const kind of this.kinds) {
      if (typeof kind.betweenEachPass === 'function') {
        kind.betweenEachPass();
      }
    }
  }

  afterEachPass() {
    for (const kind of this.kinds) {
      if (typeof kind.afterEachPass === 'function') {
        kind.afterEachPass();
      }
    }

    this.effects = [];
    this.kinds = new Set();
  }

  shouldPerform(kind: EffectKind) {
    const {include} = this;

    if (!include) {
      return false;
    }

    return include === true || (kind != null && include.includes(kind.id));
  }
}

export const EffectContext = React.createContext<EffectManager | undefined>(
  undefined,
);
