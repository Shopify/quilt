import React from 'react';
import {mount} from '@shopify/react-testing';

import {useMountedRef} from '../mounted-ref';

describe('useMountedRef()', () => {
  it('returns a ref with current value as true when the component is mounted', () => {
    const spy = jest.fn((_: boolean) => {});

    function MockComponent() {
      const mounted = useMountedRef();
      spy(mounted.current);
      return null;
    }

    mount(<MockComponent />);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('returns a ref with current value as false when the component is un-mounted', async () => {
    const promise = createResolvablePromise(null);
    const spy = jest.fn((_: boolean) => {});

    function MockComponent() {
      const mounted = useMountedRef();

      async function handleOnClick() {
        await promise;
        spy(mounted.current);
      }

      return (
        <button onClick={handleOnClick} type="button">
          Resolved Promise
        </button>
      );
    }

    const mockComponent = mount(<MockComponent />);
    mockComponent.find('button')!.trigger('onClick');
    mockComponent.unmount();

    await promise.resolve();

    expect(spy).toHaveBeenCalledWith(false);
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
      await new Promise((resolve) => process.nextTick(resolve));
      return value;
    },
    reject: rejecter,
    promise,
  };
}
