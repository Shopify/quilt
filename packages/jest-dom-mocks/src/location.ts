export default class Location {
  private isUsingMockLocation = false;
  private assignSpy?: jest.SpyInstance;
  private reloadSpy?: jest.SpyInstance;
  private replaceSpy?: jest.SpyInstance;

  mock() {
    if (this.isUsingMockLocation) {
      throw new Error(
        'You tried to mock window.location when it was already mocked.',
      );
    }

    // https://github.com/facebook/jest/issues/890
    Reflect.defineProperty(window.location, 'search', {
      writable: true,
      value: '',
    });
    // https://github.com/facebook/jest/issues/9471
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {...window.location},
    });

    this.assignSpy = jest.spyOn(window.location, 'assign');
    this.reloadSpy = jest.spyOn(window.location, 'reload');
    this.replaceSpy = jest.spyOn(window.location, 'replace');

    this.isUsingMockLocation = true;
  }

  restore() {
    if (!this.isUsingMockLocation) {
      throw new Error(
        'You tried to restore window.location when it was already restored.',
      );
    }

    location.search = '';
    this.assignSpy!.mockRestore();
    this.reloadSpy!.mockRestore();
    this.replaceSpy!.mockRestore();
    this.isUsingMockLocation = false;
  }

  isMocked() {
    return this.isUsingMockLocation;
  }
}
