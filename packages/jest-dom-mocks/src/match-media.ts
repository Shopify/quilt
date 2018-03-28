import {noop} from '@shopify/javascript-utilities/other';

export interface MediaMatching {
  (mediaQuery: string): Partial<MediaQueryList>;
}

export default class MatchMedia {
  private isUsingFakeMatchMedia = false;
  originalMatchMedia: (mediaQuery: string) => MediaQueryList;

  mock(media: MediaMatching = defaultMatcher) {
    this.originalMatchMedia = window.matchMedia;
    window.matchMedia = (query: string) => mediaQueryList(media(query));
    this.isUsingFakeMatchMedia = true;
  }

  restore() {
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
