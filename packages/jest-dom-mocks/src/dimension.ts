import {memoize} from '@shopify/javascript-utilities/decorators';

const enum SupportedDimension {
  OffsetWidth = 'offsetWidth',
  OffsetHeight = 'offsetHeight',
  ScrollWidth = 'scrollWidth',
  ScrollHeight = 'scrollHeight',
}

type MockedGetter = (element: HTMLElement) => number;
type Mock = MockedGetter | number;
type Mocks = Partial<Record<string, Mock>>;

type AugmentedElement = Element & {[key: string]: Mock};

interface NativeImplentationMap {
  [key: string]: Element;
}

function isGetterFunction(mock?: Mock): mock is MockedGetter {
  return mock != null && typeof mock === 'function';
}

export default class Dimension {
  private isUsingMock = false;
  private overwrittenImplementations: string[] = [];

  mock(mocks: Mocks) {
    if (this.isUsingMock) {
      throw new Error(
        'Dimensions are already mocked, but you tried to mock them again.',
      );
    } else if (Object.keys(mocks).length === 0) {
      throw new Error('No dimensions provided for mocking');
    }

    this.mockDOMMethods(mocks);
    this.isUsingMock = true;
  }

  restore() {
    if (!this.isUsingMock) {
      throw new Error(
        "Dimensions haven't been mocked, but you are trying to restore them.",
      );
    }

    this.restoreDOMMethods();
    this.isUsingMock = false;
  }

  isMocked() {
    return this.isUsingMock;
  }

  @memoize()
  private get nativeImplementations(): NativeImplentationMap {
    return {
      [SupportedDimension.OffsetWidth]: HTMLElement.prototype,
      [SupportedDimension.OffsetHeight]: HTMLElement.prototype,
      [SupportedDimension.ScrollWidth]: Element.prototype,
      [SupportedDimension.ScrollHeight]: Element.prototype,
    };
  }

  private mockDOMMethods(mocks: Mocks) {
    Object.keys(mocks).forEach(method => {
      const nativeSource = this.nativeImplementations[method];
      const mock: Mock | undefined = mocks[method];

      this.overwrittenImplementations.push(method);

      if (isGetterFunction(mock)) {
        Object.defineProperty(nativeSource, method, {
          get() {
            return mock.call(this, this);
          },
          configurable: true,
        });
      } else {
        Object.defineProperty(nativeSource, method, {
          value: mocks[method],
          configurable: true,
        });
      }
    });
  }

  private restoreDOMMethods() {
    this.overwrittenImplementations.forEach(method => {
      const nativeSource = this.nativeImplementations[method];

      if (nativeSource == null) {
        return;
      }

      delete (nativeSource as AugmentedElement)[method];
    });

    this.overwrittenImplementations = [];
  }
}
