import {set} from './utilities';

interface BrowserConnection extends NetworkInformation {
  downlink: number;
  effectiveType: string;
  onchange: null | Function;
  rtt: number;
  saveData: boolean;
}

export interface NavigatorWithConnection extends Navigator {
    connection: BrowserConnection;
}

export class Connection {
  private isUsingMockConnection = false;
  private originalConnection?: NavigatorWithConnection['connection'];

  mock(timing: Partial<NavigatorWithConnection['connection']> = {}) {
    const globalNavigator = navigator as NavigatorWithConnection;
    if (this.isUsingMockConnection) {
      throw new Error(
        'You tried to mock navigator.connection when it was already mocked.',
      );
    }

    this.originalConnection = globalNavigator.connection;

    const mockConnection: NavigatorWithConnection['connection'] = {
      downlink: 0,
      effectiveType: '3g',
      onchange: null,
      rtt: 100,
      saveData: false,
      ...timing,
    };

    set(globalNavigator, 'connection', mockConnection);
    this.isUsingMockConnection = true;
  }

  restore() {
    const globalNavigator = navigator as NavigatorWithConnection;
    if (!this.isUsingMockConnection) {
      throw new Error(
        'You tried to restore navigator.connection when it was already restored.',
      );
    }

    set(globalNavigator, 'connection', this.originalConnection);
    this.isUsingMockConnection = false;
  }

  isMocked() {
    return this.isUsingMockConnection;
  }
}
