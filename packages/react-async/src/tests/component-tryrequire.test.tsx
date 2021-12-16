import React, {Component} from 'react';
import {random, name} from 'faker';
import {DeferTiming} from '@shopify/async';
import {createMount} from '@shopify/react-testing';
import {
  Hydrator,
  HydrationContext,
  HydrationManager,
} from '@shopify/react-hydrate';
import {
  requestIdleCallback,
  intersectionObserver,
} from '@shopify/jest-dom-mocks';

import {AssetTiming} from '../types';
import {createAsyncComponent} from '../component';

import {
  createResolvablePromise,
  createRejectablePromise,
  getUsedAssets,
  withIgnoredReactErrorLogs,
  IGNORE_ERRORS,
  createCatcher,
} from './utilities';

const mount = createMount<{hydrated?: boolean}>({
  render(element, _, {hydrated = false}) {
    const hydrationManager = new HydrationManager();
    hydrationManager.hydrated = hydrated;

    return (
      <HydrationContext.Provider value={hydrationManager}>
        {element}
      </HydrationContext.Provider>
    );
  },
});

function ResolvedComponent({name = 'friend'}: {name?: string}) {
  return <>Hello, {name}!</>;
}

function Loading() {
  return <>Loading…</>;
}

jest.mock('@shopify/async', () => {
  return {
    ...jest.requireActual('@shopify/async'),
    createResolver: jest.fn(),
  };
});

const mockCreateResolver = jest.requireMock('@shopify/async').createResolver;

describe('createAsyncComponent()', () => {
  beforeEach(() => {
    requestIdleCallback.mock();
    intersectionObserver.mock();
  });

  afterEach(() => {
    requestIdleCallback.cancelIdleCallbacks();
    requestIdleCallback.restore();
    intersectionObserver.restore();
    mockCreateResolver.mockRestore();
  });

  describe('tryRequire renderError', () => {
    it('calls a custom renderError with the error and renders the result', async () => {
      const actualCreateResolver = jest.requireActual('@shopify/async')
        .createResolver;
      const errorContent = 'oh no!';
      const tryRequireError = new Error(errorContent);
      const renderError = jest.fn(() => <div>{errorContent}</div>);
      mockCreateResolver.mockImplementation((params) => {
        const resolver = actualCreateResolver(params);
        jest
          .spyOn(resolver, 'requireError', 'get')
          .mockReturnValue({id: 'bad', error: tryRequireError});
        return resolver;
      });
      const resolvable = createResolvablePromise(ResolvedComponent);

      const AsyncComponent = createAsyncComponent({
        load: () => resolvable.promise,
        renderError,
      });

      const asyncComponent = mount(<AsyncComponent />);

      await asyncComponent.act(() => resolvable.resolve());

      expect(asyncComponent).toContainReactText(errorContent);
    });
  });
});
