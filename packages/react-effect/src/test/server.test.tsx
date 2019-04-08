/**
 * @jest-environment node
 */

import * as React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import {clock} from '@shopify/jest-dom-mocks';

import {Effect} from '../Effect';
import {extract} from '../server';

describe('extract()', () => {
  beforeEach(() => {
    clock.mock();
  });

  afterEach(() => {
    clock.restore();
  });

  it('calls effects', async () => {
    const spy = jest.fn(() => undefined);
    await extract(<Effect perform={spy} />);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('waits for effects to resolve', async () => {
    const {promise, resolve, resolved} = createResolvablePromise();
    const spy = jest.fn(() => (resolved() ? promise : undefined));
    const extractSpy = jest.fn();
    const extractPromise = extract(<Effect perform={spy} />).then(extractSpy);

    expect(extractSpy).not.toHaveBeenCalled();

    await resolve();
    // Some versions of Node need one extra tick for all .then()
    // calls on the promise to resolve
    await new Promise(resolve => process.nextTick(resolve));

    expect(extractSpy).toHaveBeenCalled();

    await extractPromise;
  });

  it('calls betweenEachPass on each used kind', async () => {
    const {resolve, resolved} = createResolvablePromise();
    const kind = {id: Symbol('id'), betweenEachPass: jest.fn()};
    await extract(
      <Effect
        perform={() => (resolved() ? undefined : resolve())}
        kind={kind}
      />,
    );
    expect(kind.betweenEachPass).toHaveBeenCalledTimes(1);
  });

  it('calls afterEachPass on each used kind', async () => {
    const kind = {id: Symbol('id'), afterEachPass: jest.fn()};
    await extract(<Effect perform={noop} kind={kind} />);
    expect(kind.afterEachPass).toHaveBeenCalledTimes(1);
  });

  it('does not perform effects outside of extract()', () => {
    const spy = jest.fn(() => undefined);
    renderToString(<Effect perform={spy} />);
    expect(spy).not.toHaveBeenCalled();
  });

  describe('decorate', () => {
    it('is called with the app element', async () => {
      const spy = jest.fn((element: any) => element);
      const element = <div>Hello world</div>;
      await extract(element, {decorate: spy});
      expect(spy).toHaveBeenCalledWith(element);
    });
  });

  describe('renderFunction', () => {
    it('returns the result of calling renderToStaticMarkup by default', async () => {
      const element = <div>Hello world</div>;
      const result = await extract(element);
      expect(result).toBe(renderToStaticMarkup(element));
    });

    it('uses a custom render function', async () => {
      const mockResult = '<how-did-i-get-here />';
      const spy = jest.fn(() => mockResult);
      const element = <div>Hello world</div>;
      const result = await extract(element, {renderFunction: spy});
      expect(result).toBe(mockResult);
    });
  });

  describe('betweenEachPass', () => {
    it('is not called when there is only a single pass', async () => {
      const spy = jest.fn();
      await extract(<Effect perform={noop} />, {
        betweenEachPass: spy,
      });
      expect(spy).not.toHaveBeenCalled();
    });

    it('is called between passes', async () => {
      const spy = jest.fn();
      const {resolve, resolved} = createResolvablePromise();
      await extract(
        <Effect perform={() => (resolved() ? undefined : resolve())} />,
        {
          betweenEachPass: spy,
        },
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('is called with details about the pass', async () => {
      const spy = jest.fn();
      const renderDuration = 10;
      const resolveDuration = 100;
      const {resolve, resolved} = createResolvablePromise();

      await extract(
        <Effect
          perform={() => {
            return resolved()
              ? undefined
              : resolve().then(() => {
                  clock.tick(resolveDuration);
                });
          }}
        />,
        {
          betweenEachPass: spy,
          renderFunction: (element: React.ReactElement<any>) => {
            clock.tick(renderDuration);
            return renderToString(element);
          },
        },
      );

      expect(spy).toHaveBeenCalledWith({
        index: 0,
        finished: false,
        renderDuration,
        resolveDuration,
      });
    });
  });

  describe('afterEachPass', () => {
    it('is called when there is only a single pass', async () => {
      const spy = jest.fn();
      await extract(<Effect perform={noop} />, {
        afterEachPass: spy,
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('is called after each pass', async () => {
      const spy = jest.fn();
      const {resolve, resolved} = createResolvablePromise();
      await extract(
        <Effect perform={() => (resolved() ? undefined : resolve())} />,
        {
          afterEachPass: spy,
        },
      );
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('is called with details about the pass', async () => {
      const spy = jest.fn();
      const renderDuration = 10;
      const resolveDuration = 100;
      const {resolve, resolved} = createResolvablePromise();

      await extract(
        <Effect
          perform={() => {
            return resolved()
              ? undefined
              : resolve().then(() => {
                  clock.tick(resolveDuration);
                });
          }}
        />,
        {
          afterEachPass: spy,
          renderFunction: (element: React.ReactElement<any>) => {
            clock.tick(renderDuration);
            return renderToString(element);
          },
        },
      );

      expect(spy).toHaveBeenCalledWith({
        index: 0,
        finished: false,
        renderDuration,
        resolveDuration,
      });

      expect(spy).toHaveBeenLastCalledWith({
        index: 1,
        finished: true,
        renderDuration,
        resolveDuration: 0,
      });
    });
  });

  describe('include', () => {
    it('calls effects matching the passed IDs', async () => {
      const id = Symbol('id');
      const spy = jest.fn(() => undefined);
      await extract(<Effect perform={spy} kind={{id}} />, {
        include: [id],
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('does not call effects that don’t match the passed IDs', async () => {
      const id = Symbol('id');
      const spy = jest.fn();
      await extract(<Effect perform={spy} kind={{id}} />, {
        include: [],
      });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('maxPasses', () => {
    it('does not perform another pass when the limit is reached', async () => {
      const spy = jest.fn();
      const maxPasses = 2;
      const {resolve} = createResolvablePromise();

      await extract(<Effect perform={resolve} />, {
        maxPasses,
        afterEachPass: spy,
      });

      expect(spy).toHaveBeenCalledTimes(maxPasses);
      expect(spy).not.toHaveBeenCalledWith({
        finished: true,
      });
    });
  });
});

function createResolvablePromise() {
  let promiseResolve!: () => void;
  let resolved = false;

  const promise = new Promise(resolve => {
    promiseResolve = resolve;
  });

  return {
    promise,
    resolve: () => {
      promiseResolve();
      resolved = true;
      return promise;
    },
    resolved: () => resolved,
  };
}

function noop() {}
