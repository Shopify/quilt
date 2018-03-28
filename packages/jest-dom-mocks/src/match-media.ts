import {noop} from '@shopify/javascript-utilities/other';

export interface MediaMatching {
  (mediaQuery: string): Partial<MediaQueryList>;
}

export default class MatchMedia {
  private isUsingFakeMatchMedia = false;
  originalMatchMedia: (mediaQuery: string) => MediaQueryList;

  mock(media: MediaMatching = defaultMatcher) {
    if (this.isUsingFakeMatchMedia) {
      throw new Error(
        'You tried to mock window.matchMedia when it was already mocked.',
      );
    }

    this.originalMatchMedia = window.matchMedia;
    window.matchMedia = (query: string) => mediaQueryList(media(query));
    this.isUsingFakeMatchMedia = true;
  }

  restore() {
    if (!this.isUsingFakeMatchMedia) {
      throw new Error(
        'You tried to restore window.matchMedia when it was already restored.',
      );
    }

    window.matchMedia = this.originalMatchMedia;
    this.isUsingFakeMatchMedia = false;
  }

  isMocked() {
    return this.isUsingFakeMatchMedia;
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
