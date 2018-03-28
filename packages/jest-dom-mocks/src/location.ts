export default class Location {
  private isUsingFakeLocation = false;
  private originalAssign: typeof window.location.assign;
  private locationMock: jest.Mock<{}> | null;

  mock() {
    if (this.isUsingFakeLocation) {
      throw new Error(
        'You tried to fake window.location when it was already faked.',
      );
    }

    // required to make it possible to write to locaiton.search in tests
    // https://github.com/facebook/jest/issues/890
    Object.defineProperty(window.location, 'search', {
      writable: true,
      value: '',
    });

    this.originalAssign = window.location.assign;
    this.locationMock = jest.fn();
    window.location.assign = this.locationMock;
    this.isUsingFakeLocation = true;
  }

  restore() {
    if (!this.isUsingFakeLocation) {
      throw new Error(
        'You tried to restore window.location when it was already restored.',
      );
    }

    location.search = '';
    this.locationMock = null;
    window.location.assign = this.originalAssign;
    this.isUsingFakeLocation = false;
  }

  isMocked() {
    return this.isUsingFakeLocation;
  }
}
