import * as React from 'react';
import {func, shape} from 'prop-types';
import {
  render,
  isWebpackReady,
  flushInitializers,
  ChunkState,
  chunkLoader,
} from './utilities';

export type Initializer = () => React.ReactNode;

const ALL_INITIALIZERS: Initializer[] = [];
const READY_INITIALIZERS: Initializer[] = [];

interface Options {
  loader: Promise<any> | null;
  loading: React.ReactNode | null;
  delay?: number;
  timeout?: number | null;
  modules?: string[];
  render?: (loadedChunk, props) => React.ReactNode;
  webpack?: () => Promise<any>[];
}

function asyncChunkGenerator(
  chunkLoader: (loader) => ChunkState,
  options: Options,
) {
  if (!options.loading) {
    throw new Error('@shopify/async-chunks requires a `loading` component');
  }

  const opts: Options = Object.assign(
    {
      loader: null,
      loading: null,
      delay: 200,
      timeout: null,
      render,
      webpack: null,
      modules: null,
    },
    options,
  );

  let chunk: ChunkState | null = null;

  function init(): Promise<any> {
    if (chunk === null) {
      chunk = chunkLoader(opts.loader);
    }

    return chunk && chunk.promise
      ? chunk.promise
      : Promise.reject(new Error('Async chunk could not be resolved properly'));
  }

  ALL_INITIALIZERS.push(init);

  if (typeof opts.webpack === 'function') {
    READY_INITIALIZERS.push(() => {
      return isWebpackReady(opts.webpack) ? init() : null;
    });
  }

  const contextTypes = {
    loadable: shape({
      report: func.isRequired,
    }),
  };

  return class LoadableComponent extends React.Component<{}, ChunkState> {
    static contextTypes = contextTypes;

    static preload() {
      return init();
    }

    state: ChunkState = {
      error: chunk && chunk.error,
      pastDelay: false,
      timedOut: false,
      loading: (chunk && chunk.loading) || false,
      loadedChunk: chunk && chunk.loadedChunk,
      promise: null,
    };

    delay;
    timeout;
    mounted = false;

    constructor(props) {
      super(props);
      init();
    }

    componentWillMount() {
      this.mounted = true;
      this.loadModule();
    }

    componentWillUnmount() {
      this.mounted = false;
      this.clearTimeouts();
    }

    render() {
      const {loading, error, pastDelay, timedOut, loadedChunk} = this.state;
      if (loading || error) {
        const loading = opts.loading ? opts.loading : 'loading';
        return React.createElement(loading as any, {
          isLoading: loading,
          pastDelay,
          timedOut,
          error,
          retry: this.retry,
        });
      } else if (loadedChunk) {
        return opts.render && opts.render(loadedChunk, this.props);
      } else {
        return null;
      }
    }

    loadModule() {
      if (this.context.loadable && Array.isArray(opts.modules)) {
        // report SSR modules with the module name (i.e the async chunks detected)
        opts.modules.forEach(moduleName => {
          this.context.loadable.report(moduleName);
        });
      }

      if (chunk && !chunk.loading) {
        return;
      }

      if (typeof opts.delay === 'number') {
        if (opts.delay === 0) {
          this.setState({pastDelay: true});
        } else {
          this.delay = setTimeout(() => {
            this.setState({pastDelay: true});
          }, opts.delay);
        }
      }

      if (typeof opts.timeout === 'number') {
        this.timeout = setTimeout(() => {
          this.setState({timedOut: true});
        }, opts.timeout);
      }

      const promise = chunk && chunk.promise;
      promise &&
        promise
          // eslint-disable-next-line
          .then(() => {
            this.update();
          })
          .catch(err => {
            this.update();
            throw err;
          });
    }

    update() {
      if (!this.mounted) {
        return;
      }

      this.setState({
        error: chunk && chunk.error,
        loadedChunk: chunk && chunk.loadedChunk,
        loading: (chunk && chunk.loading) || false,
      });

      this.clearTimeouts();
    }

    retry() {
      this.setState({error: null, loading: true, timedOut: false});
      chunk = chunkLoader(opts.loader);
      this.loadModule();
    }

    clearTimeouts() {
      clearTimeout(this.delay);
      clearTimeout(this.timeout);
    }
  };
}

export function preloadAll() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
  });
}

export function preloadReady() {
  return new Promise(resolve => {
    // Will always resolve, errors should be handled within loading UIs.
    // eslint-disable-next-line promise/catch-or-return
    flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
  });
}

export default function asyncChunk(opts) {
  return asyncChunkGenerator(chunkLoader, opts);
}
