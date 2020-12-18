import {
  Retainer,
  RETAINED_BY,
  RETAIN_METHOD,
  RELEASE_METHOD,
  MemoryManageable,
} from './types';

export {RETAINED_BY, RETAIN_METHOD, RELEASE_METHOD};
export type {Retainer, MemoryManageable};

export class StackFrame {
  private readonly memoryManaged = new Set<MemoryManageable>();

  add(memoryManageable: MemoryManageable) {
    this.memoryManaged.add(memoryManageable);
    memoryManageable[RETAINED_BY].add(this);
    memoryManageable[RETAIN_METHOD]();
  }

  release() {
    for (const memoryManaged of this.memoryManaged) {
      memoryManaged[RETAINED_BY].delete(this);
      memoryManaged[RELEASE_METHOD]();
    }

    this.memoryManaged.clear();
  }
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
        (canRetain, item) => retain(item, {deep}) || canRetain,
        canRetain,
      );
    } else if (typeof value === 'object' && value != null) {
      return Object.keys(value).reduce(
        (canRetain, key) => retain(value[key], {deep}) || canRetain,
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
        (canRelease, item) => release(item, {deep}) || canRelease,
        canRelease,
      );
    } else if (typeof value === 'object' && value != null) {
      return Object.keys(value).reduce(
        (canRelease, key) => release(value[key], {deep}) || canRelease,
        canRelease,
      );
    }
  }

  return canRelease;
}
