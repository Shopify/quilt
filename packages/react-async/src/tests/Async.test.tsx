import * as React from 'react';
import {mount} from 'enzyme';

import {Async} from '../Async';
import {AsyncContext} from '../context';

import {createManager} from './utilities';

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

  it('calls manager.markAsUsed() with the result of id() when the module is actually loaded', async () => {
    const id = 'foo-bar';
    const promise = createResolvablePromise(MockComponent);
    const manager = createManager();
    const spy = jest.spyOn(manager, 'markAsUsed');

    mount(
      <AsyncContext.Provider value={manager}>
        <Async load={() => promise.promise} id={() => id} />
      </AsyncContext.Provider>,
    );

    expect(spy).not.toHaveBeenCalled();

    await promise.resolve();

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
