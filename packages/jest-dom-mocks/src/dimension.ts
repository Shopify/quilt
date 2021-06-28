enum SupportedDimension {
  InnerWidth = 'innerWidth',
  OffsetWidth = 'offsetWidth',
  OffsetHeight = 'offsetHeight',
  ScrollWidth = 'scrollWidth',
  ScrollHeight = 'scrollHeight',
}

type DimensionMap = {[T in SupportedDimension]: HTMLElement | Element};
type MockedDimensions = {[T in SupportedDimension]: number};

export default class Dimension {
  private dimensionMap!: DimensionMap;
  private undoMocks: Function[] = [];

  mock(mocks: Partial<MockedDimensions>) {
    if (this.isMocked()) {
      throw new Error(
        'Dimensions are already mocked, but you tried to mock them again.',
      );
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

    this.undoMocks.push(...this.applyMocks(mocks));
  }

  restore() {
    if (!this.isMocked()) {
      throw new Error(
        "Dimensions haven't been mocked, but you are trying to restore them.",
      );
    }

    [...this.undoMocks].reverse().forEach((undo) => undo());
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

      Object.defineProperty(base, key, {value: properties[key]});

      return () => {
        Object.defineProperty(base, key, {...orignalDescriptor});
      };
    });
  }
}
