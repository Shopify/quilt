import {noop} from '@shopify/javascript-utilities/other';

export interface MediaMatching {
  (mediaQuery: string): Partial<MediaQueryList>;
}

export default class MatchMedia {
  originalMatchMedia: (mediaQuery: string) => MediaQueryList;
  private isUsingMockMatchMedia = false;

  mock(media: MediaMatching = defaultMatcher) {
    if (this.isUsingMockMatchMedia) {
      throw new Error(
        'You tried to mock window.matchMedia when it was already mocked.',
      );
    }

    this.originalMatchMedia = window.matchMedia;
    this.isUsingMockMatchMedia = true;

    this.setMedia(media);
  }

  restore() {
    if (!this.isUsingMockMatchMedia) {
      throw new Error(
        'You tried to restore window.matchMedia when it was already restored.',
      );
    }

    window.matchMedia = this.originalMatchMedia;
    this.isUsingMockMatchMedia = false;
  }

  isMocked() {
    return this.isUsingMockMatchMedia;
  }

  setMedia(media: MediaMatching = defaultMatcher) {
    this.ensureMatchMediaIsMocked();
    window.matchMedia = (query: string) => mediaQueryList(media(query));
  }

  private ensureMatchMediaIsMocked() {
    if (!this.isUsingMockMatchMedia) {
      throw new Error(
        'You must call matchMedia.mock() before interacting with the mock matchMedia.',
      );
    }
  }
}

function defaultMatcher(): MediaQueryList {
  return {media: '', addListener: noop, removeListener: noop, matches: false};
}

export function mediaQueryList(
  values: Partial<MediaQueryList>,
): MediaQueryList {
  // Explictly state a return type as TypeScript does not attempt to shrink the
  // type when using Object spread. Without the explicit return type TypeScript
  // exports a type that exposes the internals of `MediaQueryList` (which
  // changed in TS 3.1.0).
  // This ensures that this function can be used in projects that use any
  // version of Typescript instead of only <3.1.0 or >= 3.1.0 depending on the
  // version that this library was compiled using.
  return {
    ...defaultMatcher(),
    ...values,
  };
}
