import {createEndpoint} from '../endpoint';
import {fromMessagePort} from '../adaptors';

import {MessageChannel} from './utilities';

describe('createEndpoint()', () => {
  it('calls the exposed API of the paired endpoint', async () => {
    const {port1, port2} = new MessageChannel();
    const endpoint1 = createEndpoint<{hello(): string}>(fromMessagePort(port1));
    const endpoint2 = createEndpoint(fromMessagePort(port2));

    const spy = jest.fn(() => 'world');
    endpoint2.expose({hello: spy});

    expect(await endpoint1.call.hello()).toBe('world');
  });

  describe('functions', () => {
    it('is available on the endpoint', () => {
      const {port1} = new MessageChannel();
      const functions = {} as any;
      const endpoint = createEndpoint(fromMessagePort(port1), {
        createFunctionStrategy: () => functions,
      });
      expect(endpoint).toHaveProperty('functions', functions);
    });

    it('is called to serialize and deserialize functions', async () => {
      const name = 'Chris';
      const intermediateValue = 'FUNCTION_STANDIN';
      const functionStrategy = {
        toWire: jest.fn<[string], any[]>(() => [intermediateValue]),
        fromWire: jest.fn(() => () => name),
        has: () => false,
      };
      const createFunctionStrategy = jest.fn(() => functionStrategy);

      const {port1, port2} = new MessageChannel();

      const endpoint1 = createEndpoint<{
        greet(user: {getName(): string}): string;
      }>(fromMessagePort(port1), {
        createFunctionStrategy,
      });

      const endpoint2 = createEndpoint(fromMessagePort(port2), {
        createFunctionStrategy,
      });

      endpoint2.expose({
        greet: async (user: {getName(): Promise<string>}) =>
          `Hello, ${await user.getName()}`,
      });

      expect(createFunctionStrategy).toHaveBeenCalledWith({
        messenger: expect.any(Object),
        toWire: expect.any(Function),
        fromWire: expect.any(Function),
        uuid: expect.any(Function),
      });
      expect(await endpoint1.call.greet({getName: () => 'Chris'})).toBe(
        'Hello, Chris',
      );
    });
  });

  describe('#replace()', () => {
    it('replaces the underlying messenger', async () => {
      const {port1, port2} = new MessageChannel();

      const endpoint1 = createEndpoint<{hello(): string}>(
        fromMessagePort(port1),
      );
      const endpoint2 = createEndpoint(fromMessagePort(port2));
      endpoint2.expose({hello: () => 'world'});

      const {port1: newPort1, port2: newPort2} = new MessageChannel();
      endpoint1.replace(fromMessagePort(newPort1));
      endpoint2.replace(fromMessagePort(newPort2));

      expect(await endpoint1.call.hello()).toBe('world');
    });
  });

  describe('#expose()', () => {
    it('allows a new method to be called from the paired endpoint', async () => {
      const {port1, port2} = new MessageChannel();

      const endpoint1 = createEndpoint<{hello(): string}>(
        fromMessagePort(port1),
      );
      const endpoint2 = createEndpoint(fromMessagePort(port2));

      await expect(endpoint1.call.hello()).rejects.toMatchObject({
        message: expect.stringContaining('hello'),
      });

      endpoint2.expose({hello: () => 'world'});

      expect(await endpoint1.call.hello()).toBe('world');
    });

    it('deletes an exposed value by passing undefined', async () => {
      const {port1, port2} = new MessageChannel();

      const endpoint1 = createEndpoint<{hello(): string}>(
        fromMessagePort(port1),
      );
      const endpoint2 = createEndpoint(fromMessagePort(port2));

      endpoint2.expose({hello: () => 'world'});
      endpoint2.expose({hello: undefined});

      await expect(endpoint1.call.hello()).rejects.toMatchObject({
        message: expect.stringContaining('hello'),
      });
    });
  });

  describe('#terminate()', () => {
    it('calls terminate on the message endpoint', () => {
      const {port1} = new MessageChannel();
      const messenger = fromMessagePort(port1);
      const endpoint = createEndpoint(messenger);

      const spy = jest.spyOn(messenger, 'terminate');

      endpoint.terminate();
      expect(spy).toHaveBeenCalled();
    });

    it('calls terminate on the function strategy', () => {
      const spy = jest.fn();
      const {port1} = new MessageChannel();
      const endpoint = createEndpoint(fromMessagePort(port1), {
        createFunctionStrategy: () => ({terminate: spy} as any),
      });

      endpoint.terminate();
      expect(spy).toHaveBeenCalled();
    });

    it('throws an error when calling a method on a terminated endpoint', () => {
      const {port1} = new MessageChannel();
      const endpoint = createEndpoint<{hello(): string}>(
        fromMessagePort(port1),
      );

      endpoint.terminate();

      expect(() => endpoint.call.hello()).toThrow(/terminated/);
    });
  });
});
