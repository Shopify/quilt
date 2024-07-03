import {fetch} from '@shopify/jest-dom-mocks';

import {requestMatcher, createMockHandler} from './utilities';
import {fixtures} from './fixtures';
import type {MockOptions} from './types';

export * from './fixtures';

export function mockCountryRequests(options: MockOptions = {}) {
  fetch.post(
    requestMatcher,
    createMockHandler(() => fixtures),
    {
      overwriteRoutes: false,
      ...options,
    },
  );
}
