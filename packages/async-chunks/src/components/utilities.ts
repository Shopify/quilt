import * as React from 'react';
import {Initializer} from './AsyncChunk';

// eslint-disable-next-line camelcase
declare const __webpack_modules__: any;

export function render(loaded, props) {
  return React.createElement(resolve(loaded), props);
}

function resolve(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

export function isWebpackReady(getModuleIds) {
  // eslint-disable-next-line camelcase
  if (typeof __webpack_modules__ !== 'object') {
    return false;
  }

  return getModuleIds().every(moduleId => {
    return (
      typeof moduleId !== 'undefined' &&
      // eslint-disable-next-line camelcase
      typeof __webpack_modules__[moduleId] !== 'undefined'
    );
  });
}

export function flushInitializers(initializers: Initializer[]) {
  const promises: React.ReactNode[] = [];

  while (initializers.length) {
    const init = initializers.pop();
    if (init) {
      promises.push(init());
    }
  }

  return (
    Promise.all(promises)
      // eslint-disable-next-line consistent-return
      .then(() => {
        // eslint-disable-next-line promise/always-return
        if (initializers.length) {
          return flushInitializers(initializers);
        }
      })
      .catch(error => error)
  );
}

export interface ChunkState {
  loading: boolean;
  promise: Promise<any> | null;
  loadedChunk: React.ReactNode | null;
  error: Error | null;
  pastDelay?: boolean;
  timedOut?: boolean;
}

export function chunkLoader(chunkLoader): ChunkState {
  const state: ChunkState = {
    loading: true,
    loadedChunk: null,
    promise: null,
    error: null,
  };

  state.promise = chunkLoader()
    .then(chunk => {
      state.loading = false;
      state.loadedChunk = chunk;
      return chunk;
    })
    .catch(err => {
      state.loading = false;
      state.error = err;
      throw err;
    });

  return state;
}
