import React from 'react';
import {random} from 'faker';
import {mount} from '@shopify/react-testing';
import {requestIdleCallback} from '@shopify/jest-dom-mocks';

import {createAsyncContext} from '../provider';
import {AssetTiming} from '../types';

import {getUsedAssets, createResolvablePromise} from './utilities';

describe('createAsyncContext()', () => {
  beforeEach(() => {
    requestIdleCallback.mock();
  });

  afterEach(() => {
    requestIdleCallback.restore();
  });

  describe('<Provider />', () => {
    it('provides null when the value has not been loaded', () => {
      const resolvable = createResolvablePromise({});
      const AsyncContext = createAsyncContext({load: () => resolvable.promise});
      const asyncContext = mount(<AsyncContext.Provider />);
      expect(asyncContext).toProvideReactContext(AsyncContext.Context, null);
    });

    it('provides the resolved value once it has been loaded', async () => {
      const value = 'hello world';
      const resolvable = createResolvablePromise(value);
      const AsyncContext = createAsyncContext({load: () => resolvable.promise});
      const asyncContext = mount(<AsyncContext.Provider />);

      await asyncContext.act(() => resolvable.resolve());

      expect(asyncContext).toProvideReactContext(AsyncContext.Context, value);
    });

    it('marks the asset as used', async () => {
      const id = random.uuid();
      const resolvable = createResolvablePromise({});

      const AsyncContext = createAsyncContext({
        id: () => id,
        load: () => resolvable.promise,
      });

      const asyncAssets = await getUsedAssets(
        <AsyncContext.Provider />,
        AssetTiming.Immediate,
      );

      expect(asyncAssets).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<Consumer />', () => {
    it('renders a real Context.Consumer', async () => {
      const children = () => null;
      const resolvable = createResolvablePromise({});
      const AsyncContext = createAsyncContext({load: () => resolvable.promise});
      const asyncContext = mount(
        <AsyncContext.Provider>
          <AsyncContext.Consumer>{children}</AsyncContext.Consumer>
        </AsyncContext.Provider>,
      );

      await asyncContext.act(() => resolvable.resolve());

      expect(asyncContext).toContainReactComponent(
        AsyncContext.Context.Consumer,
        {children},
      );
    });
  });

  describe('<Preload />', () => {
    it('loads the script in an idle callback', async () => {
      const resolvable = createResolvablePromise({});
      const load = jest.fn(() => resolvable.promise);
      const AsyncContext = createAsyncContext({load});

      const asyncContext = mount(<AsyncContext.Preload />);

      expect(load).not.toHaveBeenCalled();

      await asyncContext.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('marks the asset as used on the next page', async () => {
      const id = random.uuid();
      const resolvable = createResolvablePromise({});

      const AsyncContext = createAsyncContext({
        id: () => id,
        load: () => resolvable.promise,
      });

      const asyncAssets = await getUsedAssets(
        <AsyncContext.Preload />,
        AssetTiming.NextPage,
      );

      expect(asyncAssets).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<Prefetch />', () => {
    it('loads the script in on mount', () => {
      const resolvable = createResolvablePromise({});
      const load = jest.fn(() => resolvable.promise);
      const AsyncContext = createAsyncContext({load});

      mount(<AsyncContext.Prefetch />);

      expect(load).toHaveBeenCalled();
    });

    it('marks the asset as used on the next page', async () => {
      const id = random.uuid();
      const resolvable = createResolvablePromise({});

      const AsyncContext = createAsyncContext({
        id: () => id,
        load: () => resolvable.promise,
      });

      const asyncAssets = await getUsedAssets(
        <AsyncContext.Prefetch />,
        AssetTiming.NextPage,
      );

      expect(asyncAssets).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<KeepFresh />', () => {
    it('loads the script in an idle callback', async () => {
      const resolvable = createResolvablePromise({});
      const load = jest.fn(() => resolvable.promise);
      const AsyncContext = createAsyncContext({load});

      const asyncContext = mount(<AsyncContext.KeepFresh />);

      expect(load).not.toHaveBeenCalled();

      await asyncContext.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('marks the asset as used on the next page', async () => {
      const id = random.uuid();
      const resolvable = createResolvablePromise({});

      const AsyncContext = createAsyncContext({
        id: () => id,
        load: () => resolvable.promise,
      });

      const asyncAssets = await getUsedAssets(
        <AsyncContext.KeepFresh />,
        AssetTiming.NextPage,
      );

      expect(asyncAssets).toContainEqual({
        id,
        scripts: true,
        styles: true,
      });
    });
  });
});
