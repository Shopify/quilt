interface Observer {
  source: unknown;
  target: Element;
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
}

export default class IntersectionObserverMock {
  observers: Observer[] = [];

  private isUsingMockIntersectionObserver = false;
  private originalIntersectionObserver = (global as any).IntersectionObserver;
  private originalIntersectionObserverEntry = (global as any)
    .IntersectionObserverEntry;

  simulate(
    entry:
      | Partial<IntersectionObserverEntry>
      | Partial<IntersectionObserverEntry>[],
  ) {
    this.ensureMocked();

    const arrayOfEntries = Array.isArray(entry) ? entry : [entry];
    const targets = arrayOfEntries.map(({target}) => target);
    const noCustomTargets = targets.every(target => target == null);

    for (const observer of this.observers) {
      if (noCustomTargets || targets.includes(observer.target)) {
        observer.callback(
          arrayOfEntries.map(entry => normalizeEntry(entry, observer.target)),
          observer as any,
        );
      }
    }
  }

  mock() {
    if (this.isUsingMockIntersectionObserver) {
      throw new Error(
        'IntersectionObserver is already mocked, but you tried to mock it again.',
      );
    }

    this.isUsingMockIntersectionObserver = true;

    const setObservers = (setter: (observers: Observer[]) => Observer[]) =>
      (this.observers = setter(this.observers));

    (global as any).IntersectionObserverEntry = class IntersectionObserverEntry {};
    Object.defineProperty(
      IntersectionObserverEntry.prototype,
      'intersectionRatio',
      {
        get() {
          return 0;
        },
      },
    );

    (global as any).IntersectionObserver = class FakeIntersectionObserver {
      constructor(
        private callback: IntersectionObserverCallback,
        private options?: IntersectionObserverInit,
      ) {}

      observe(target: Element) {
        setObservers(observers => [
          ...observers,
          {
            source: this,
            target,
            callback: this.callback,
            options: this.options,
          },
        ]);
      }

      disconnect() {
        setObservers(observers =>
          observers.filter(observer => observer.source !== this),
        );
      }

      unobserve(target: Element) {
        setObservers(observers =>
          observers.filter(
            observer =>
              !(observer.target === target && observer.source === this),
          ),
        );
      }
    };
  }

  restore() {
    if (!this.isUsingMockIntersectionObserver) {
      throw new Error(
        'IntersectionObserver is already real, but you tried to restore it again.',
      );
    }

    (global as any).IntersectionObserver = this.originalIntersectionObserver;
    (global as any).IntersectionObserverEntry = this.originalIntersectionObserverEntry;

    this.isUsingMockIntersectionObserver = false;
    this.observers.length = 0;
  }

  isMocked() {
    return this.isUsingMockIntersectionObserver;
  }

  private ensureMocked() {
    if (!this.isUsingMockIntersectionObserver) {
      throw new Error(
        'You must call intersectionObserver.mock() before interacting with the fake IntersectionObserver.',
      );
    }
  }
}

function normalizeEntry(
  entry: Partial<IntersectionObserverEntry>,
  target: Element,
): IntersectionObserverEntry {
  const isIntersecting =
    entry.isIntersecting == null
      ? Boolean(entry.intersectionRatio)
      : entry.isIntersecting;

  const intersectionRatio = entry.intersectionRatio || (isIntersecting ? 1 : 0);

  return {
    boundingClientRect:
      entry.boundingClientRect || target.getBoundingClientRect(),
    intersectionRatio,
    intersectionRect: entry.intersectionRect || target.getBoundingClientRect(),
    isIntersecting,
    rootBounds: entry.rootBounds || document.body.getBoundingClientRect(),
    target,
    time: entry.time || Date.now(),
  };
}
