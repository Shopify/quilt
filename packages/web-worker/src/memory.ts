export const RETAIN_METHOD = Symbol('retain');
export const RELEASE_METHOD = Symbol('release');
export const RETAINED_BY = Symbol('retainedBy');

export interface Retainer {
  add(manageable: MemoryManageable): void;
}

export interface MemoryManageable {
  readonly [RETAINED_BY]: Set<Retainer>;
  [RETAIN_METHOD](): void;
  [RELEASE_METHOD](): void;
}

export function isMemoryManageable(value: unknown): value is MemoryManageable {
  return Boolean(
    value && (value as any)[RETAIN_METHOD] && (value as any)[RELEASE_METHOD],
  );
}

export function retain(value: any) {
  if (isMemoryManageable(value)) {
    value[RETAIN_METHOD]();
  }
}

export function release(value: any) {
  if (isMemoryManageable(value)) {
    value[RELEASE_METHOD]();
  }
}
