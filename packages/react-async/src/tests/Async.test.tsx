import * as React from 'react';
import {mount} from 'enzyme';
import {Effect} from '@shopify/react-effect';
import {trigger} from '@shopify/enzyme-utilities';

import {Async} from '../Async';
import {AsyncAssetContext} from '../context/assets';

import {createAsyncAssetManager} from './utilities';

jest.mock('@shopify/react-effect', () => ({
  Effect() {
    return null;
  },
}));

function MockComponent() {
  return null;
}

describe('<Async />', () => {
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

    await promise.resolve();
    async.update();

    expect(render).toHaveBeenCalledWith(MockComponent);
    expect(async.find(MockComponent)).toHaveLength(1);
  });

  it('calls render() with a default export', async () => {
    const promise = createResolvablePromise({default: MockComponent});
    const render = jest.fn(() => null);

    const async = mount(<Async load={() => promise.promise} render={render} />);

    await promise.resolve();
    async.update();

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

    expect(async.find(Effect)).toHaveLength(0);

    await promise.resolve();
    async.update();

    trigger(async.find(Effect), 'perform');

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
    expect(async).toContainReact(<Loading />);
  });
});

function createResolvablePromise<T>(value: T) {
  let resolver: () => Promise<T>;
  let rejecter: () => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolver = () => {
      resolve(value);
      return promise;
    };
    rejecter = reject;
  });

  return {
    resolve: async () => {
      // eslint-disable-next-line typescript/no-non-null-assertion
      const value = await resolver!();
      // If we just resolve, the tick that actually processes the promise
      // has not finished yet.
      await new Promise(resolve => process.nextTick(resolve));
      return value;
    },
    // eslint-disable-next-line typescript/no-non-null-assertion
    reject: rejecter!,
    promise,
  };
}
