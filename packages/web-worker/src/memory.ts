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

export function retain(value: any, {deep = true} = {}) {
  const canRetain = isMemoryManageable(value);

  if (canRetain) {
    value[RETAIN_METHOD]();
  }

  if (deep) {
    if (Array.isArray(value)) {
      return value.reduce(
        (canRetain, item) => retain(item, {deep: true}) || canRetain,
      );
    } else if (typeof value === 'object' && value != null) {
      return Object.keys(value).reduce(
        (canRetain, key) => retain(value[key]) || canRetain,
        canRetain,
      );
    }
  }

  return canRetain;
}

export function release(value: any, {deep = true} = {}) {
  const canRelease = isMemoryManageable(value);

  if (canRelease) {
    value[RELEASE_METHOD]();
  }

  if (deep) {
    if (Array.isArray(value)) {
      return value.reduce(
        (canRelease, item) => release(item, {deep: true}) || canRelease,
      );
    } else if (typeof value === 'object' && value != null) {
      return Object.keys(value).reduce(
        (canRelease, key) => release(value[key]) || canRelease,
        canRelease,
      );
    }
  }

  return canRelease;
}
