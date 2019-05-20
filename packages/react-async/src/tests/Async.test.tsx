import * as React from 'react';
import {mount, destroyAll} from '@shopify/react-testing';
import {Effect} from '@shopify/react-effect';
import {DeferTiming} from '@shopify/async';
import {IntersectionObserver} from '@shopify/react-intersection-observer';
import {requestIdleCallback} from '@shopify/jest-dom-mocks';

import {Async} from '../Async';
import {PreloadPriority} from '../shared';
import {AsyncAssetContext} from '../context/assets';

import {createAsyncAssetManager} from './utilities';

jest.mock('@shopify/react-effect', () => ({
  Effect() {
    return null;
  },
}));

jest.mock('@shopify/react-intersection-observer', () => ({
  ...require.requireActual('@shopify/react-intersection-observer'),
  IntersectionObserver() {
    return null;
  },
}));

function MockComponent() {
  return null;
}

describe('<Async />', () => {
  beforeEach(() => {
    requestIdleCallback.mock();
  });

  afterEach(() => {
    destroyAll();
    requestIdleCallback.restore();
  });

  it('does not call render() before the resolved module is available', () => {
    const promise = createResolvablePromise(MockComponent);
    const render = jest.fn(() => null);

    mount(<Async load={() => promise.promise} render={render} />);

    expect(render).not.toHaveBeenCalled();
  });

  it('calls render() with the resolved module and renders the result', async () => {
    const promise = createResolvablePromise(MockComponent);
    const render = jest.fn(
      (Component: typeof MockComponent | null) => Component && <Component />,
    );

    const async = mount(<Async load={() => promise.promise} render={render} />);

    expect(render).not.toHaveBeenCalledWith(MockComponent);

    await async.act(() => promise.resolve());

    expect(render).toHaveBeenCalledWith(MockComponent);
    expect(async).toContainReactComponent(MockComponent);
  });

  it('calls render() with a default export', async () => {
    const promise = createResolvablePromise({default: MockComponent});
    const render = jest.fn(() => null);

    const async = mount(<Async load={() => promise.promise} render={render} />);

    await async.act(() => promise.resolve());

    expect(render).toHaveBeenCalledWith(MockComponent);
  });

  it('creates an effect that calls manager.markAsUsed() with the result of id() when the module is actually loaded', async () => {
    const id = 'foo-bar';
    const promise = createResolvablePromise(MockComponent);
    const manager = createAsyncAssetManager();
    const spy = jest.spyOn(manager, 'markAsUsed');

    const async = mount(
      <AsyncAssetContext.Provider value={manager}>
        <Async load={() => promise.promise} id={() => id} />
      </AsyncAssetContext.Provider>,
    );

    expect(async).not.toContainReactComponent(Effect);

    await async.act(() => promise.resolve());

    async.find(Effect)!.trigger('perform');

    expect(spy).toHaveBeenCalledWith(id);
  });

  it('calls renderLoading() before the resolved module is available', () => {
    function Loading() {
      return null;
    }

    const promise = createResolvablePromise(MockComponent);
    const renderLoading = jest.fn(() => <Loading />);

    const async = mount(
      <Async load={() => promise.promise} renderLoading={renderLoading} />,
    );

    expect(renderLoading).toHaveBeenCalled();
    expect(async).toContainReactComponent(Loading);
  });

  describe('defer', () => {
    it('loads the module in an idle callback when defer is DeferTiming.Idle', () => {
      const promise = createResolvablePromise({default: MockComponent});
      const load = jest.fn(() => promise.promise);

      mount(<Async defer={DeferTiming.Idle} load={load} render={() => null} />);
      expect(load).not.toHaveBeenCalled();

      requestIdleCallback.runIdleCallbacks();
      expect(load).toHaveBeenCalled();
    });

    it('loads the module on viewport intersection when defer is DeferTiming.InViewport', async () => {
      const promise = createResolvablePromise({default: MockComponent});
      const load = jest.fn(() => promise.promise);

      const async = mount(
        <Async
          defer={DeferTiming.InViewport}
          load={load}
          render={() => null}
        />,
      );

      expect(load).not.toHaveBeenCalled();
      expect(async).toContainReactComponent(IntersectionObserver, {
        threshold: 0,
      });

      const intersectingPromise = async
        .find(IntersectionObserver)!
        .trigger('onIntersectionChange', {isIntersecting: true});

      await async.act(async () => {
        await promise.resolve();
        await intersectingPromise;
      });

      expect(async).not.toContainReactComponent(IntersectionObserver);
      expect(load).toHaveBeenCalled();
    });
  });
});

function createResolvablePromise<T>(value: T) {
  let resolver!: () => Promise<T>;
  let rejecter!: () => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolver = () => {
      resolve(value);
      return promise;
    };
    rejecter = reject;
  });

  return {
    resolve: async () => {
      const value = await resolver();
      // If we just resolve, the tick that actually processes the promise
      // has not finished yet.
      await new Promise(resolve => process.nextTick(resolve));
      return value;
    },
    reject: rejecter,
    promise,
  };
}
