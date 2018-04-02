import {noop} from '@shopify/javascript-utilities/other';

export interface MediaMatching {
  (mediaQuery: string): Partial<MediaQueryList>;
}

export default class MatchMedia {
  private isUsingMockMatchMedia = false;
  originalMatchMedia: (mediaQuery: string) => MediaQueryList;

  mock(media: MediaMatching = defaultMatcher) {
    if (this.isUsingMockMatchMedia) {
      throw new Error(
        'You tried to mock window.matchMedia when it was already mocked.',
      );
    }

    this.originalMatchMedia = window.matchMedia;
    window.matchMedia = (query: string) => mediaQueryList(media(query));
    this.isUsingMockMatchMedia = true;
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
}

function defaultMatcher(): MediaQueryList {
  return {media: '', addListener: noop, removeListener: noop, matches: false};
}

export function mediaQueryList(values: Partial<MediaQueryList>) {
  return {
    ...defaultMatcher(),
    ...values,
  };
}
