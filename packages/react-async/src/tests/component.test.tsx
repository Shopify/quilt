import React, {Component} from 'react';
import {random, name} from 'faker';
import {DeferTiming} from '@shopify/async';
import {createMount} from '@shopify/react-testing';
import {
  Hydrator,
  HydrationContext,
  HydrationManager,
} from '@shopify/react-hydrate';
import {
  requestIdleCallback,
  intersectionObserver,
} from '@shopify/jest-dom-mocks';

import {AssetTiming} from '../types';
import {createAsyncComponent} from '../component';

import {
  createResolvablePromise,
  createRejectablePromise,
  getUsedAssets,
} from './utilities';

const mount = createMount<{hydrated?: boolean}>({
  render(element, _, {hydrated = false}) {
    const hydrationManager = new HydrationManager();
    hydrationManager.hydrated = hydrated;

    return (
      <HydrationContext.Provider value={hydrationManager}>
        {element}
      </HydrationContext.Provider>
    );
  },
});

function ResolvedComponent({name = 'friend'}: {name?: string}) {
  return <>Hello, {name}!</>;
}

function Loading() {
  return <>Loading…</>;
}

describe('createAsyncComponent()', () => {
  beforeEach(() => {
    requestIdleCallback.mock();
    intersectionObserver.mock();
  });

  afterEach(() => {
    requestIdleCallback.cancelIdleCallbacks();
    requestIdleCallback.restore();
    intersectionObserver.restore();
  });

  describe('rendering', () => {
    describe('loading', () => {
      it('calls a custom renderLoading with the component props and renders the result', () => {
        const props = {name: name.firstName()};
        const renderLoading = jest.fn(() => <Loading />);
        const resolvable = createResolvablePromise(ResolvedComponent);

        const AsyncComponent = createAsyncComponent({
          load: () => resolvable.promise,
          renderLoading,
        });

        const asyncComponent = mount(<AsyncComponent {...props} />);

        expect(renderLoading).toHaveBeenCalledWith(props);
        expect(asyncComponent).toContainReactComponent(Loading);
      });

      it('does not render loading content when the component has resolved', async () => {
        const props = {name: name.firstName()};
        const renderLoading = jest.fn(() => <Loading />);
        const resolvable = createResolvablePromise(ResolvedComponent);

        const AsyncComponent = createAsyncComponent({
          load: () => resolvable.promise,
          renderLoading,
        });

        const asyncComponent = mount(<AsyncComponent {...props} />);

        await asyncComponent.act(() => resolvable.resolve());

        expect(renderLoading).toHaveBeenCalledTimes(1);
        expect(asyncComponent).not.toContainReactComponent(Loading);
      });
    });

    describe('error', () => {
      it('throws the error by default', async () => {
        const spy = jest.fn();
        const error = new Error();
        const rejectable = createRejectablePromise(error);
        const Catcher = createCatcher(spy);

        const AsyncComponent = createAsyncComponent({
          load: () => rejectable.promise,
        });

        const asyncComponent = mount(
          <Catcher>
            <AsyncComponent />
          </Catcher>,
        );

        await withIgnoredReactErrorLogs(() =>
          asyncComponent.act(() => rejectable.reject()),
        );

        expect(spy).toHaveBeenCalledWith(error);
      });

      it('calls a custom renderError with the error and renders the result', async () => {
        const errorContent = 'Oh no!';
        const renderError = jest.fn(() => <div>{errorContent}</div>);

        const error = new Error();
        const rejectable = createRejectablePromise(error);

        const AsyncComponent = createAsyncComponent({
          load: () => rejectable.promise,
          renderError,
        });

        const asyncComponent = mount(<AsyncComponent />);

        await asyncComponent.act(() => rejectable.reject());

        expect(renderError).toHaveBeenCalledWith(error);
        expect(asyncComponent).toContainReactText(errorContent);
      });
    });

    describe('resolved', () => {
      it('renders the resolved component with the original props', async () => {
        const props = {name: name.firstName()};
        const resolvable = createResolvablePromise(ResolvedComponent);
        const AsyncComponent = createAsyncComponent({
          load: () => resolvable.promise,
        });

        const asyncComponent = mount(<AsyncComponent {...props} />);

        await asyncComponent.act(() => resolvable.resolve());

        expect(asyncComponent).toContainReactComponent(
          ResolvedComponent,
          props,
        );
      });
    });
  });

  describe('defer', () => {
    describe('unset', () => {
      it('starts loading the component on mount', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({load});

        expect(load).not.toHaveBeenCalled();

        mount(<AsyncComponent />);

        expect(load).toHaveBeenCalled();
      });

      it('marks the assets as being used immediately', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.Immediate),
        ).toContainEqual({id, scripts: true, styles: true});
      });
    });

    describe('function', () => {
      it('is called with the props of the component', () => {
        const props = {name: name.firstName()};
        const defer = jest.fn(() => false);

        const AsyncComponent = createAsyncComponent({
          load: () => createResolvablePromise(ResolvedComponent).promise,
          defer,
        });

        mount(<AsyncComponent {...props} />);

        expect(defer).toHaveBeenCalledWith(props);
      });

      it('does not start loading when defer returns false', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          defer: () => false,
        });

        mount(<AsyncComponent />);

        expect(load).not.toHaveBeenCalled();
      });

      it('starts loading when defer returns true', () => {
        const defer = jest.fn(() => false);
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          defer,
        });

        const asyncComponent = mount(<AsyncComponent />);

        defer.mockReturnValue(true);
        asyncComponent.setProps({name: name.firstName()});

        expect(defer).toHaveBeenCalledTimes(2);
        expect(load).toHaveBeenCalled();
      });

      it('marks the assets as being used on the current page', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          defer: () => false,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: true});
      });
    });

    describe('DeferTiming.Mount', () => {
      it('starts loading the component on mount', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          defer: DeferTiming.Mount,
        });

        expect(load).not.toHaveBeenCalled();

        mount(<AsyncComponent />);

        expect(load).toHaveBeenCalled();
      });

      it('marks the assets as being used on the current page', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          defer: DeferTiming.Mount,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: true});
      });
    });

    describe('DeferTiming.Idle', () => {
      it('starts loading the component on idle callback', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          defer: DeferTiming.Idle,
        });
        const asyncComponent = mount(<AsyncComponent />);

        expect(load).not.toHaveBeenCalled();

        asyncComponent.act(() => {
          requestIdleCallback.runIdleCallbacks();
        });

        expect(load).toHaveBeenCalled();
      });

      it('marks the assets as being used on the current page', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          defer: DeferTiming.Idle,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: true});
      });
    });

    describe('DeferTiming.InViewport', () => {
      it('does not start loading the component if it is not in the viewport', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          defer: DeferTiming.InViewport,
        });
        const asyncComponent = mount(<AsyncComponent />);

        asyncComponent.act(() => {
          intersectionObserver.simulate({
            isIntersecting: false,
          });
        });

        expect(load).not.toHaveBeenCalled();
      });

      it('starts loading the component when it is in the viewport', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          defer: DeferTiming.InViewport,
        });
        const asyncComponent = mount(<AsyncComponent />);

        expect(load).not.toHaveBeenCalled();

        asyncComponent.act(() => {
          intersectionObserver.simulate({
            isIntersecting: true,
          });
        });

        expect(load).toHaveBeenCalled();
      });

      it('marks the assets as being used on the current page', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          defer: DeferTiming.InViewport,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: true});
      });
    });
  });

  describe('deferHydration', () => {
    it('renders a Hydrator with the provided ID instead of the loading state', () => {
      const id = random.uuid();
      const renderLoading = jest.fn(() => <Loading />);
      const resolvable = createResolvablePromise(ResolvedComponent);

      const AsyncComponent = createAsyncComponent({
        id: () => id,
        load: () => resolvable.promise,
        renderLoading,
        deferHydration: DeferTiming.Idle,
      });

      const asyncComponent = mount(<AsyncComponent />);

      expect(renderLoading).not.toHaveBeenCalled();
      expect(asyncComponent).toContainReactComponent(Hydrator, {id});
    });

    it('wraps the rendered component in a Hydrator with the provided ID on the server', async () => {
      const id = random.uuid();
      const resolvable = createResolvablePromise(ResolvedComponent);

      const AsyncComponent = createAsyncComponent({
        id: () => id,
        load: () => resolvable.promise,
        deferHydration: DeferTiming.Idle,
      });

      await resolvable.resolve();
      await AsyncComponent.resolver.resolve();

      const asyncComponent = mount(<AsyncComponent />, {hydrated: false});

      expect(asyncComponent).toContainReactComponent(Hydrator, {id});
      expect(asyncComponent.find(Hydrator)).toContainReactComponent(
        ResolvedComponent,
      );
    });

    it('renders the loading state if the component started rendering after hydration', () => {
      const renderLoading = jest.fn(() => <Loading />);
      const resolvable = createResolvablePromise(ResolvedComponent);

      const AsyncComponent = createAsyncComponent({
        load: () => resolvable.promise,
        renderLoading,
        deferHydration: DeferTiming.Idle,
      });

      const asyncComponent = mount(<AsyncComponent />, {hydrated: true});

      expect(renderLoading).toHaveBeenCalled();
      expect(asyncComponent).toContainReactComponent(Loading);
      expect(asyncComponent).not.toContainReactComponent(Hydrator);
    });

    it('ignores the defer property when loading if the page is not hydrated', () => {
      const load = jest.fn(
        () => createResolvablePromise(ResolvedComponent).promise,
      );

      const AsyncComponent = createAsyncComponent({
        load,
        defer: DeferTiming.Idle,
        deferHydration: DeferTiming.InViewport,
      });

      const asyncComponent = mount(<AsyncComponent />, {hydrated: false});

      asyncComponent.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).not.toHaveBeenCalled();
    });

    it('loads based on the defer property if the page is already hydrated', () => {
      const load = jest.fn(
        () => createResolvablePromise(ResolvedComponent).promise,
      );

      const AsyncComponent = createAsyncComponent({
        load,
        defer: DeferTiming.Idle,
        deferHydration: DeferTiming.InViewport,
      });

      const asyncComponent = mount(<AsyncComponent />, {hydrated: true});

      asyncComponent.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    describe('function', () => {
      it('is called with the props of the component', () => {
        const props = {name: name.firstName()};
        const deferHydration = jest.fn(() => false);

        const AsyncComponent = createAsyncComponent({
          load: () => createResolvablePromise(ResolvedComponent).promise,
          deferHydration,
        });

        mount(<AsyncComponent {...props} />);

        expect(deferHydration).toHaveBeenCalledWith(props);
      });

      it('does not start loading when deferHydration returns false', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          deferHydration: () => false,
        });

        mount(<AsyncComponent />);

        expect(load).not.toHaveBeenCalled();
      });

      it('starts loading when deferHydration returns true', () => {
        const deferHydration = jest.fn(() => false);
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          deferHydration,
        });

        const asyncComponent = mount(<AsyncComponent />);

        deferHydration.mockReturnValue(true);
        asyncComponent.setProps({name: name.firstName()});

        expect(deferHydration).toHaveBeenCalledTimes(2);
        expect(load).toHaveBeenCalled();
      });

      it('marks the scripts as being used on the current page, and styles as being used immediately', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          deferHydration: () => false,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: false});

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.Immediate),
        ).toContainEqual({id, scripts: false, styles: true});
      });
    });

    describe('DeferTiming.Mount', () => {
      it('starts loading the component on mount', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          deferHydration: DeferTiming.Mount,
        });

        expect(load).not.toHaveBeenCalled();

        mount(<AsyncComponent />);

        expect(load).toHaveBeenCalled();
      });

      it('marks the scripts as being used on the current page, and styles as being used immediately', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          deferHydration: DeferTiming.Mount,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: false});

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.Immediate),
        ).toContainEqual({id, scripts: false, styles: true});
      });
    });

    describe('DeferTiming.Idle', () => {
      it('starts loading the component on idle callback', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          deferHydration: DeferTiming.Idle,
        });
        const asyncComponent = mount(<AsyncComponent />);

        expect(load).not.toHaveBeenCalled();

        asyncComponent.act(() => {
          requestIdleCallback.runIdleCallbacks();
        });

        expect(load).toHaveBeenCalled();
      });

      it('marks the scripts as being used on the current page, and styles as being used immediately', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          deferHydration: DeferTiming.Idle,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: false});

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.Immediate),
        ).toContainEqual({id, scripts: false, styles: true});
      });
    });

    describe('DeferTiming.InViewport', () => {
      it('does not start loading the component if it is not in the viewport', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          deferHydration: DeferTiming.InViewport,
        });
        const asyncComponent = mount(<AsyncComponent />);

        asyncComponent.act(() => {
          intersectionObserver.simulate({
            isIntersecting: false,
          });
        });

        expect(load).not.toHaveBeenCalled();
      });

      it('starts loading the component when it is in the viewport', () => {
        const load = jest.fn(
          () => createResolvablePromise(ResolvedComponent).promise,
        );
        const AsyncComponent = createAsyncComponent({
          load,
          deferHydration: DeferTiming.InViewport,
        });
        const asyncComponent = mount(<AsyncComponent />);

        expect(load).not.toHaveBeenCalled();

        asyncComponent.act(() => {
          intersectionObserver.simulate({
            isIntersecting: true,
          });
        });

        expect(load).toHaveBeenCalled();
      });

      it('marks the scripts as being used on the current page, and styles as being used immediately', async () => {
        const id = random.uuid();
        const AsyncComponent = createAsyncComponent({
          id: () => id,
          load: () => createResolvablePromise(ResolvedComponent).promise,
          deferHydration: DeferTiming.InViewport,
        });

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.CurrentPage),
        ).toContainEqual({id, scripts: true, styles: false});

        expect(
          await getUsedAssets(<AsyncComponent />, AssetTiming.Immediate),
        ).toContainEqual({id, scripts: false, styles: true});
      });
    });
  });

  describe('<Preload />', () => {
    it('loads the component assets in an idle callback', () => {
      const load = jest.fn(() => resolvable.promise);
      const resolvable = createResolvablePromise(ResolvedComponent);
      const AsyncComponent = createAsyncComponent({load});

      const asyncComponent = mount(<AsyncComponent.Preload />);

      expect(load).not.toHaveBeenCalled();

      asyncComponent.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('calls a custom usePreload hook immediately, and its result in an idle callback', () => {
      const preload = jest.fn();
      const usePreload = jest.fn(() => preload);
      const resolvable = createResolvablePromise(ResolvedComponent);
      const AsyncComponent = createAsyncComponent({
        load: () => resolvable.promise,
        usePreload,
      });

      const asyncComponent = mount(<AsyncComponent.Preload />);

      expect(preload).not.toHaveBeenCalled();
      expect(usePreload).toHaveBeenCalled();

      asyncComponent.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(preload).toHaveBeenCalled();
    });

    it('marks the assets as being used on the next page', async () => {
      const id = random.uuid();
      const AsyncComponent = createAsyncComponent({
        id: () => id,
        load: () => createResolvablePromise(ResolvedComponent).promise,
      });

      expect(
        await getUsedAssets(<AsyncComponent.Preload />, AssetTiming.NextPage),
      ).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<Prefetch />', () => {
    it('loads the component assets on mount', () => {
      const load = jest.fn(() => resolvable.promise);
      const resolvable = createResolvablePromise(ResolvedComponent);
      const AsyncComponent = createAsyncComponent({load});

      mount(<AsyncComponent.Prefetch />);

      expect(load).toHaveBeenCalled();
    });

    it('calls a custom usePrefetch hook and its result on mount', () => {
      const prefetch = jest.fn();
      const usePrefetch = jest.fn(() => prefetch);
      const resolvable = createResolvablePromise(ResolvedComponent);
      const AsyncComponent = createAsyncComponent({
        load: () => resolvable.promise,
        usePrefetch,
      });

      mount(<AsyncComponent.Prefetch />);

      expect(prefetch).toHaveBeenCalled();
      expect(usePrefetch).toHaveBeenCalled();
    });

    it('marks the assets as being used on the next page', async () => {
      const id = random.uuid();
      const AsyncComponent = createAsyncComponent({
        id: () => id,
        load: () => createResolvablePromise(ResolvedComponent).promise,
      });

      expect(
        await getUsedAssets(<AsyncComponent.Prefetch />, AssetTiming.NextPage),
      ).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<KeepFresh />', () => {
    it('loads the component assets in an idle callback', () => {
      const load = jest.fn(() => resolvable.promise);
      const resolvable = createResolvablePromise(ResolvedComponent);
      const AsyncComponent = createAsyncComponent({load});

      const asyncComponent = mount(<AsyncComponent.Preload />);

      expect(load).not.toHaveBeenCalled();

      asyncComponent.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('calls a custom useKeepFresh hook immediately, and its result in an idle callback', () => {
      const keepFresh = jest.fn();
      const useKeepFresh = jest.fn(() => keepFresh);
      const resolvable = createResolvablePromise(ResolvedComponent);
      const AsyncComponent = createAsyncComponent({
        load: () => resolvable.promise,
        useKeepFresh,
      });

      const asyncComponent = mount(<AsyncComponent.KeepFresh />);

      expect(keepFresh).not.toHaveBeenCalled();
      expect(useKeepFresh).toHaveBeenCalled();

      asyncComponent.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(keepFresh).toHaveBeenCalled();
    });

    it('marks the assets as being used on the next page', async () => {
      const id = random.uuid();
      const AsyncComponent = createAsyncComponent({
        id: () => id,
        load: () => createResolvablePromise(ResolvedComponent).promise,
      });

      expect(
        await getUsedAssets(<AsyncComponent.KeepFresh />, AssetTiming.NextPage),
      ).toContainEqual({id, scripts: true, styles: true});
    });
  });
});

function createCatcher(callback: (error: Error) => void) {
  return class Catcher extends Component<{}, {error?: Error}> {
    static getDerivedStateFromError(error: Error) {
      return {error};
    }

    state: {error?: Error} = {};

    componentDidCatch(error: Error) {
      callback(error);
    }

    render() {
      return this.state.error ? null : this.props.children;
    }
  };
}

const IGNORE_ERRORS = [
  /The above error occurred in the <.*> component/,
  /at Object.invokeGuardedCallbackDev/,
];

/* eslint-disable no-console */
function withIgnoredReactErrorLogs(perform: () => unknown) {
  const originalConsoleError = console.error;

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      IGNORE_ERRORS.some((regex) => regex.test(args[0]))
    ) {
      return;
    }

    return originalConsoleError(...args);
  };

  const cleanup = () => {
    console.error = originalConsoleError;
  };

  const result = perform();

  if (
    typeof result === 'object' &&
    result != null &&
    'then' in result &&
    'catch' in result
  ) {
    return (result as Promise<unknown>)
      .then((resolvedResult) => {
        cleanup();
        return resolvedResult;
      })
      .catch((error) => {
        cleanup();
        return error;
      });
  }

  cleanup();
  return result;
}
/* eslint-enable no-console */
