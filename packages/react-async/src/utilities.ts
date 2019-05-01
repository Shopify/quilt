import {Import, LoadProps, DeferTiming} from '@shopify/async';

export async function resolve<T>(load: () => Promise<Import<T>>): Promise<T> {
  const resolved = await load();
  return normalize(resolved);
}

function normalize(module: any) {
  if (module == null) {
    return null;
  }

  const value = 'default' in module ? module.default : module;
  return value == null ? null : value;
}

/* eslint-disable babel/camelcase */
declare const __webpack_require__: (id: string) => any;
declare const __webpack_modules__: {[key: string]: any};
/* eslint-enable babel/camelcase */

// Webpack does not like seeing an explicit require(someVariable) in code
// because that is a dynamic require that it can’t resolve. This code
// obfuscates `require()` for the purpose of fooling Webpack, which is fine
// because we only want to use the `require()` in cases where Webpack
// is not the module bundler.
//
// If we ever reference `require` directly, Webpack complains. So, we first
// check global["require"], which works in Node. However, this doesn’t work
// in Jest when the test is set to simulate a browser, as global in that case
// in a Window object. There, we can only rely on module.require, which is
// actually supposed to be something different but in Jest is the same as
// the global require function.
const requireKey = 'require';
const nodeRequire =
  (typeof global === 'object' &&
    typeof global[requireKey] === 'function' &&
    global[requireKey]) ||
  (typeof module === 'object' &&
    typeof module[requireKey] === 'function' &&
    module[requireKey]) ||
  undefined;

// If we have an ID, we try to first use Webpack’s internal stuff
// to resolve the module. If those don’t exist, we know we aren’t
// inside of a Webpack bundle, so we try to use Node’s native resolution
// (which will work in environments like Jest’s test runner).
function tryRequire(id: string) {
  if (
    /* eslint-disable babel/camelcase */
    typeof __webpack_require__ === 'function' &&
    typeof __webpack_modules__ === 'object' &&
    __webpack_modules__[id]
    /* eslint-enable babel/camelcase */
  ) {
    try {
      return normalize(__webpack_require__(id));
    } catch {
      // Just ignore failures
    }
  } else if (typeof nodeRequire === 'function') {
    try {
      return normalize(nodeRequire(id));
    } catch {
      // Just ignore failures
    }
  }

  return undefined;
}

interface Options<T> {
  id?: LoadProps<T>['id'];
  defer?: DeferTiming;
}

export function trySynchronousResolve<T>({id, defer}: Options<T>): T | null {
  const requireId =
    (defer == null || defer === DeferTiming.Mount) && id && id();
  const resolved = requireId ? tryRequire(requireId) : null;
  return resolved;
}
