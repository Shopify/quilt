import {AsyncComponentType} from '../types';
import {usePreload, usePrefetch, useKeepFresh} from '../hooks';

describe('usePreload()', () => {
  it('returns the result of calling usePreload on the passed async component', () => {
    const result = () => {};
    const usePreloadCustom = () => result;

    const AsyncComponent = createAsyncComponentType({
      usePreload: usePreloadCustom,
    });

    expect(usePreload(AsyncComponent)).toBe(result);
  });
});

describe('usePrefetch()', () => {
  it('returns the result of calling usePrefetch on the passed async component', () => {
    const result = () => {};
    const usePrefetchCustom = () => result;

    const AsyncComponent = createAsyncComponentType({
      usePrefetch: usePrefetchCustom,
    });

    expect(usePrefetch(AsyncComponent)).toBe(result);
  });
});

describe('useKeepFresh()', () => {
  it('returns the result of calling useKeepFresh on the passed async component', () => {
    const result = () => {};
    const useKeepFreshCustom = () => result;

    const AsyncComponent = createAsyncComponentType({
      useKeepFresh: useKeepFreshCustom,
    });

    expect(useKeepFresh(AsyncComponent)).toBe(result);
  });
});

function createAsyncComponentType({
  usePreload = noop,
  usePrefetch = noop,
  useKeepFresh = noop,
}: Partial<
  Pick<
    AsyncComponentType<unknown, {}, {}, {}, {}>,
    'usePreload' | 'usePrefetch' | 'useKeepFresh'
  >
>): AsyncComponentType<unknown, {}, {}, {}, {}> {
  function AsyncComponent() {
    return null;
  }

  AsyncComponent.usePreload = usePreload;
  AsyncComponent.usePrefetch = usePrefetch;
  AsyncComponent.useKeepFresh = useKeepFresh;

  return AsyncComponent as any;
}

function noop() {
  return undefined;
}
