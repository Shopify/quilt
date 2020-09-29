import {Connection, NavigatorWithConnection} from '../connection';

describe('Connection', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const connection = new Connection();
      connection.mock();

      expect(connection.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const connection = new Connection();
      connection.mock();

      expect(() => {
        connection.mock();
      }).toThrow(
        'You tried to mock navigator.connection when it was already mocked.',
      );
    });

    it('delegates stubbed options to navigator.connection', () => {
      const connection = new Connection();
      const mockValues = {
        effectiveType: '4g',
        rtt: 32,
      };

      connection.mock(mockValues);

      expect((navigator as NavigatorWithConnection).connection).toMatchObject(
        mockValues,
      );
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const connection = new Connection();
      connection.mock();
      connection.restore();

      expect(connection.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const connection = new Connection();

      expect(() => {
        connection.restore();
      }).toThrow(
        'You tried to restore navigator.connection when it was already restored.',
      );
    });
  });
});
