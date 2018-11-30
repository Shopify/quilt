import {isSupported} from 'caniuse-api';

export interface PolyfillDescriptor {
  node: boolean;
  featureTest?: string;
}

export const polyfills: {[polyfill: string]: PolyfillDescriptor} = {
  baseline: {
    node: true,
  },
  fetch: {
    node: true,
    featureTest: 'fetch',
  },
  intl: {
    node: false,
    featureTest: 'internationalization-plural-rul',
  },
  url: {
    node: true,
    featureTest: 'urlsearchparams',
  },
};

export function mappedPolyfillsForEnv(isServer: boolean, browser: string) {
  const mappedPolyfills = {};

  Object.entries(polyfills).forEach(([polyfill, {node, featureTest}]) => {
    if (isServer) {
      mappedPolyfills[polyfill] = node ? `${polyfill}.node` : '';
    } else if (featureTest) {
      mappedPolyfills[polyfill] = isSupported(featureTest, browser)
        ? ''
        : polyfill;
    } else {
      // If there's no feature we can test for, we assume we always need to polyfill it.
      mappedPolyfills[polyfill] = polyfill;
    }
  });

  return mappedPolyfills;
}
