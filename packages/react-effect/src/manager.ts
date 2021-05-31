import {EffectKind, Pass} from './types';

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

  reset() {
    this.effects = [];
    this.kinds = new Set();
  }

  add(effect: any, kind?: EffectKind) {
    if (kind != null) {
      this.kinds.add(kind);
    }

    if (effect == null || typeof effect !== 'object' || !('then' in effect)) {
      return;
    }

    this.effects.push(effect);
  }

  async resolve() {
    await Promise.all(this.effects);
  }

  async betweenEachPass(pass: Pass) {
    await Promise.all(
      [...this.kinds].map((kind) =>
        typeof kind.betweenEachPass === 'function'
          ? kind.betweenEachPass(pass)
          : Promise.resolve(),
      ),
    );
  }

  async afterEachPass(pass: Pass) {
    const results = await Promise.all(
      [...this.kinds].map((kind) =>
        typeof kind.afterEachPass === 'function'
          ? kind.afterEachPass(pass)
          : Promise.resolve(),
      ),
    );

    return results.every((result) => result !== false);
  }

  shouldPerform(kind: EffectKind) {
    const {include} = this;

    if (!include) {
      return false;
    }

    return include === true || (kind != null && include.includes(kind.id));
  }
}
