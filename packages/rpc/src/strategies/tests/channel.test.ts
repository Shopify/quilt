import {retain, release} from '../../memory';
import {createChannelFunctionStrategy} from '../channel';

import {createFunctionStrategyPair, createResolvablePromise} from './utilities';

describe('createChannelFunctionStrategy()', () => {
  it('calls a function after serializing and deserializing it', async () => {
    const result = 'Hello';
    const name = 'Chris';
    const spy = jest.fn(() => result);

    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );
    const greet = destination.fromWire(source.toWire(spy)[0]);

    expect(await greet(name)).toBe(result);
    expect(spy).toHaveBeenCalledWith(name);
  });

  it('calls a function after exchanging it', async () => {
    const result = 'Hello';
    const spyOne = jest.fn(() => result);
    const spyTwo = jest.fn(() => result);

    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );
    const greet = destination.fromWire(source.toWire(spyOne)[0]);
    source.exchange!(spyOne, spyTwo);

    expect(await greet()).toBe(result);
    expect(spyOne).not.toHaveBeenCalled();
    expect(spyTwo).toHaveBeenCalled();
  });

  it('is released from the source when retain count hits zero', () => {
    const func = () => {};

    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );
    const result = destination.fromWire(source.toWire(func)[0]);

    expect(source.has(func)).toBe(true);
    retain(result);
    expect(source.has(func)).toBe(true);
    release(result);
    expect(source.has(func)).toBe(false);
  });

  it('throws an error when calling a released function', async () => {
    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );
    const result = destination.fromWire(source.toWire(() => {})[0]);

    retain(result);
    release(result);
    await expect(Promise.resolve().then(() => result())).rejects.toMatchObject({
      message: expect.stringContaining('released'),
    });
  });

  it('throws an error when calling a revoked function', async () => {
    const func = () => {};
    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );

    const result = destination.fromWire(source.toWire(func)[0]);
    source.revoke!(func);

    await expect(Promise.resolve().then(() => result())).rejects.toMatchObject({
      message: expect.stringContaining('revoked'),
    });
  });

  it('automatically releases functions passed as arguments to the proxied function', async () => {
    const name = 'Chris';
    const getName = () => name;

    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );

    const result = destination.fromWire(
      source.toWire((users: {getName(): Promise<string>}[]) =>
        users[0].getName(),
      )[0],
    );

    const promise = result([{getName}]);
    expect(destination.has(getName)).toBe(true);
    expect(await promise).toBe(name);
    expect(destination.has(getName)).toBe(false);
  });

  it('rejects with a matching error when the source function throws', async () => {
    const error = new Error('Oh no!');
    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );

    const result = destination.fromWire(
      source.toWire(() => {
        throw error;
      })[0],
    );

    await expect(result()).rejects.toMatchObject({
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  });

  it('resolves calls even if the results resolve out of order', async () => {
    const valueOne = createResolvablePromise('one');
    const valueTwo = createResolvablePromise('two');

    let callIndex = -1;
    const func = () => {
      callIndex += 1;
      return callIndex === 0 ? valueOne.promise : valueTwo.promise;
    };

    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );

    const result = destination.fromWire(source.toWire(func)[0]);

    const resultOne = result();
    const resultTwo = result();

    // Key bit: valueTwo resolves before valueOne
    await valueTwo.resolve();
    await valueOne.resolve();

    expect(await resultOne).toBe(await valueOne.promise);
    expect(await resultTwo).toBe(await valueTwo.promise);
  });

  it('releases all functions when terminated', () => {
    const func = () => {};

    const [source, destination] = createFunctionStrategyPair(
      createChannelFunctionStrategy,
    );

    destination.fromWire(source.toWire(func)[0]);
    source.terminate!();

    expect(source.has(func)).toBe(false);
  });
});
