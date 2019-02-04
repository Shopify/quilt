export interface EffectKind {
  readonly id: symbol;
  betweenEachPass?(): any;
  afterEachPass?(): any;
}
