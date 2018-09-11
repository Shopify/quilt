export interface MockWindow extends Window {
  addEventListener: jest.Mock<{}> & typeof window.addEventListener;
  removeEventListener: jest.Mock<{}> & typeof window.removeEventListener;
}

export default class Document {
  private isUsingMockWindow: boolean = false;
  private window?: MockWindow;

  mockWindow() {
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    return window as MockWindow;
  }

  mock() {
    if (this.isUsingMockWindow) {
      throw new Error('You tried to mock window when it was already mocked.');
    }

    this.window = this.mockWindow();
    this.window.addEventListener('load', () => {});
    this.isUsingMockWindow = true;
  }

  restore() {
    if (!this.isUsingMockWindow) {
      throw new Error(
        'You tried to restore window when it was already restored',
      );
    }

    if (this.window) {
      this.window.addEventListener.mockClear();
    }
    this.isUsingMockWindow = false;
  }

  isMocked() {
    return this.isUsingMockWindow;
  }
}
