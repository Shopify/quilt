import {NetworkManager} from '../manager';

describe('NetworkManager', () => {
  describe('getHeader', () => {
    it('returns undefined when getting a header that does not exist', () => {
      const manager = new NetworkManager();

      expect(manager.getHeader('foo')).toBeUndefined();
    });

    it('returns headers from the provided dictionary', () => {
      const headers = {
        foo: 'bar',
      };
      const manager = new NetworkManager({headers});

      expect(manager.getHeader('foo')).toBe(headers.foo);
    });

    it('is case insensitive', () => {
      const headers = {
        foo: 'bar',
      };
      const manager = new NetworkManager({headers});

      expect(manager.getHeader('FoO')).toBe(headers.foo);
    });

    it('is case insensitive when headers are initialized in a different case', () => {
      const headers = {
        Foo: 'bar',
      };
      const manager = new NetworkManager({headers});

      expect(manager.getHeader('FoO')).toBe(headers.Foo);
    });
  });

  describe('getServerState', () => {
    it('returns an empty object when there is no server state', () => {
      const manager = new NetworkManager();
      expect(manager.getServerState()).toStrictEqual({});
    });
  });

  describe('setServerState', () => {
    it('set the server state using the provided object', () => {
      const manager = new NetworkManager();
      const state = {foo: 'foo123'};

      expect(manager.getServerState()).toStrictEqual({});
      manager.setServerState(state);
      expect(manager.getServerState()).toStrictEqual(state);
    });

    it('sets the server state using the provided function', () => {
      const manager = new NetworkManager();
      const state = {foo: 'foo123'};

      manager.setServerState(state);
      manager.setServerState(currentState => {
        currentState.bar = 'bar123';
        return currentState;
      });

      expect(manager.getServerState()).toStrictEqual({
        foo: 'foo123',
        bar: 'bar123',
      });
    });
  });
});
