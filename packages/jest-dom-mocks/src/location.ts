type AssignFunction = typeof window.location.assign;
type ReloadFunction = typeof window.location.reload;
type ReplaceFunction = typeof window.location.replace;

export default class Location {
  private isUsingMockLocation = false;
  private originalAssign?: AssignFunction;
  private originalReload?: ReloadFunction;
  private originalReplace?: ReplaceFunction;

  mock() {
    if (this.isUsingMockLocation) {
      throw new Error(
        'You tried to mock window.location when it was already mocked.',
      );
    }

    // required to make it possible to write to location.search in tests
    // https://github.com/facebook/jest/issues/890
    Reflect.defineProperty(window.location, 'search', {
      writable: true,
      value: '',
    });

    this.originalAssign = window.location.assign;
    this.originalReload = window.location.reload;
    window.location.assign = jest.fn();
    window.location.reload = jest.fn();
    window.location.replace = jest.fn();
    this.isUsingMockLocation = true;
  }

  restore() {
    if (!this.isUsingMockLocation) {
      throw new Error(
        'You tried to restore window.location when it was already restored.',
      );
    }

    location.search = '';
    window.location.assign = this.originalAssign as AssignFunction;
    window.location.reload = this.originalReload as ReloadFunction;
    window.location.replace = this.originalReplace as ReplaceFunction;
    this.isUsingMockLocation = false;
  }

  isMocked() {
    return this.isUsingMockLocation;
  }
}
