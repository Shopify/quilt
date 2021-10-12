type WindowLocation = typeof window.location;

export default class Location {
  private locationSpy?: jest.SpyInstance<WindowLocation> | null;

  mock() {
    if (this.locationSpy) {
      throw new Error(
        'You tried to mock window.location when it was already mocked.',
      );
    }

    this.locationSpy = jest.spyOn(window, 'location', 'get');
    this.locationSpy.mockReturnValue({
      ...window.location,
      assign: jest.fn((..._args) => {}),
      reload: jest.fn(() => {}),
      replace: jest.fn((..._args) => {}),
    });
  }

  restore() {
    if (!this.locationSpy) {
      throw new Error(
        'You tried to restore window.location when it was already restored.',
      );
    }

    this.locationSpy!.mockRestore();
    this.locationSpy = null;
  }

  isMocked() {
    return Boolean(this.locationSpy);
  }
}
