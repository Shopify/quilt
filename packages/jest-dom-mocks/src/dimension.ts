enum SupportedDimension {
  InnerWidth = 'innerWidth',
  OffsetWidth = 'offsetWidth',
  OffsetHeight = 'offsetHeight',
  ScrollWidth = 'scrollWidth',
  ScrollHeight = 'scrollHeight',
}

type NumberOrGetter = number | ((element: HTMLElement | Element) => number);
type DimensionMap = {[T in SupportedDimension]: HTMLElement | Element};
type MockedDimensions = {[T in SupportedDimension]: NumberOrGetter};

export default class Dimension {
  private dimensionMap!: DimensionMap;
  private undoMocks: Function[] = [];

  mock(mocks: Partial<MockedDimensions>) {
    if (this.isMocked()) {
      throw new Error(
        'Dimensions are already mocked, but you tried to mock them again.',
      );
    } else if (Object.keys(mocks).length === 0) {
      throw new Error('No dimensions provided for mocking');
    }

    // We initialize this lazily so that we don’t try to reference
    // HTMLElement in test environments where it does not exist.
    this.dimensionMap = this.dimensionMap || {
      [SupportedDimension.InnerWidth]: HTMLElement.prototype,
      [SupportedDimension.OffsetWidth]: HTMLElement.prototype,
      [SupportedDimension.OffsetHeight]: HTMLElement.prototype,
      [SupportedDimension.ScrollWidth]: Element.prototype,
      [SupportedDimension.ScrollHeight]: Element.prototype,
    };

    this.undoMocks = this.applyMocks(mocks);
  }

  restore() {
    if (!this.isMocked()) {
      throw new Error(
        "Dimensions haven't been mocked, but you are trying to restore them.",
      );
    }

    [...this.undoMocks].forEach((undo) => undo());
    this.undoMocks = [];
  }

  isMocked() {
    return this.undoMocks.length > 0;
  }

  private applyMocks(properties: Partial<MockedDimensions>) {
    const keys = Object.getOwnPropertyNames(properties) as SupportedDimension[];
    return keys.map((key) => {
      const base = this.dimensionMap[key];
      const orignalDescriptor = Object.getOwnPropertyDescriptor(base, key);
      const mock = properties[key];

      if (typeof mock === 'function') {
        Object.defineProperty(base, key, {
          get() {
            return mock.call(this, this);
          },
        });
      } else {
        Object.defineProperty(base, key, {value: mock});
      }

      return () => {
        Object.defineProperty(base, key, {...orignalDescriptor});
      };
    });
  }
}
