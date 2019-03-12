import {isSupported} from 'caniuse-api';

export interface PolyfillDescriptor {
  supportsNode: boolean;
  featureTest?: string;
}

export const polyfills: {[polyfill: string]: PolyfillDescriptor} = {
  baseline: {
    supportsNode: true,
  },
  fetch: {
    supportsNode: true,
    featureTest: 'fetch',
  },
  intl: {
    supportsNode: false,
    featureTest: 'internationalization-plural-rul',
  },
  url: {
    supportsNode: true,
    featureTest: 'urlsearchparams',
  },
  'intersection-observer': {
    supportsNode: false,
    featureTest: 'intersectionobserver',
  },
};

export function mappedPolyfillsForEnv(browser: 'node' | string | string[]) {
  return Object.entries(polyfills).reduce(
    (mappedPolyfills, [polyfill, {supportsNode, featureTest}]) => {
      const mapFrom = `@shopify/polyfills/${polyfill}$`;
      const mapToPrefix = `@shopify/polyfills`;
      const noop = `@shopify/polyfills/noop`;

      if (browser === 'node') {
        mappedPolyfills[mapFrom] = supportsNode
          ? `${mapToPrefix}/${polyfill}.node`
          : noop;
      } else if (featureTest) {
        mappedPolyfills[mapFrom] = isSupported(featureTest, browser)
          ? noop
          : `${mapToPrefix}/${polyfill}`;
      } else {
        // If there's no feature we can test for, we assume we always need to polyfill it.
        mappedPolyfills[mapFrom] = `${mapToPrefix}/${polyfill}`;
      }

      return mappedPolyfills;
    },
    {},
  );
}
