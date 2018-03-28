import {noop} from '@shopify/javascript-utilities/other';

export interface MediaMatching {
  (mediaQuery: string): Partial<MediaQueryList>;
}

export default class MatchMedia {
  isUsingFakeMatchMedia = false;
  originalMatchMedia: (mediaQuery: string) => MediaQueryList;

  fake(media: MediaMatching = defaultMatcher) {
    this.originalMatchMedia = window.matchMedia;
    window.matchMedia = (query: string) => mediaQueryList(media(query));
    this.isUsingFakeMatchMedia = true;
  }

  restore() {
    window.matchMedia = this.originalMatchMedia;
    this.isUsingFakeMatchMedia = false;
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
