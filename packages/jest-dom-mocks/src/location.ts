export default class Location {
  private isUsingMockLocation = false;
  private originalAssign: typeof window.location.assign;
  private locationMock: jest.Mock<{}> | null;

  mock() {
    if (this.isUsingMockLocation) {
      throw new Error(
        'You tried to mock window.location when it was already mocked.',
      );
    }

    this.originalAssign = window.location.assign;
    this.locationMock = jest.fn();
    window.location.assign = this.locationMock;
    this.isUsingMockLocation = true;
  }

  restore() {
    if (!this.isUsingMockLocation) {
      throw new Error(
        'You tried to restore window.location when it was already restored.',
      );
    }

    location.search = '';
    this.locationMock = null;
    window.location.assign = this.originalAssign;
    this.isUsingMockLocation = false;
  }

  isMocked() {
    return this.isUsingMockLocation;
  }
}
