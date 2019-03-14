export interface Pass {
  index: number;
  finished: boolean;
  renderDuration: number;
  resolveDuration: number;
}

export interface EffectKind {
  readonly id: symbol;
  betweenEachPass?(pass: Pass): any;
  afterEachPass?(pass: Pass): any;
}
