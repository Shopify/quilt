import React from 'react';
import {mount, Root} from '@shopify/react-testing';
import {clock} from '@shopify/jest-dom-mocks';

import {EventListener} from '../EventListener';
import {Prefetcher, INTENTION_DELAY_MS} from '../Prefetcher';
import {PrefetchContext} from '../context/prefetch';
import {createPrefetchManager} from './utilities';

jest.mock('../EventListener', () => ({
  EventListener() {
    return null;
  },
}));

function MockComponent(_props: {name?: string}) {
  return null;
}

const path = '/mock/path';

describe('<Prefetch />', () => {
  beforeEach(() => {
    clock.mock();
  });

  afterEach(() => {
    clock.restore();
  });

  it('does not prefetch anything by default', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );
    expect(prefetcher).not.toContainReactComponent(MockComponent);
  });

  it('prefetches a component when hovering over an element with a matching href for enough time', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'mouseover', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    expect(prefetcher).not.toContainReactComponent(MockComponent);

    prefetcher.act(() => {
      clock.tick(INTENTION_DELAY_MS + 1);
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
  });

  it('prefetches a component when focusing on an element with a matching href for enough time', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'focusin', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    expect(prefetcher).not.toContainReactComponent(MockComponent);

    prefetcher.act(() => {
      clock.tick(INTENTION_DELAY_MS + 1);
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
  });

  it('prefetches a component when clicking on an element with a matching href immediately', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
  });

  it('prefetches a component when touching an element with a matching href immediately', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'touchstart', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
  });

  it('does not prefetch a component when mousing over, then out, of an element with a matching href', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'mouseover', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    triggerListener(prefetcher, 'mouseout', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    prefetcher.act(() => {
      clock.tick(INTENTION_DELAY_MS + 1);
    });

    expect(prefetcher).not.toContainReactComponent(MockComponent);
  });

  it('still prefetches a component when mousing over, then out into a child, of an element with a matching href', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );
    const element = mockElement(`<a href="${path}"><div></div></a>`);

    triggerListener(prefetcher, 'mouseover', {
      target: element,
    });

    triggerListener(prefetcher, 'mouseout', {
      target: element,
      relatedTarget: element.firstChild!,
    });

    prefetcher.act(() => {
      clock.tick(INTENTION_DELAY_MS + 1);
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
  });

  it('does not prefetch a component when focusing in, then out, of an element with a matching href', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'focusin', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    triggerListener(prefetcher, 'focusout', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    prefetcher.act(() => {
      clock.tick(INTENTION_DELAY_MS + 1);
    });

    expect(prefetcher).not.toContainReactComponent(MockComponent);
  });

  it('prefetches a components with matching regex paths', () => {
    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path: /.*/},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
  });

  it('prefetches multiple matching components', () => {
    function AnotherPrefetch() {
      return null;
    }

    const manager = createPrefetchManager([
      {render: () => <MockComponent />, path: /.*/},
      {render: () => <AnotherPrefetch />, path},
    ]);
    const prefetcher = mount(
      <PrefetchContext.Provider value={manager}>
        <Prefetcher />
      </PrefetchContext.Provider>,
    );

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${path}"></a>`),
    });

    expect(prefetcher).toContainReactComponent(MockComponent);
    expect(prefetcher).toContainReactComponent(AnotherPrefetch);
  });
});

function mockElement(markup: string) {
  return new DOMParser().parseFromString(markup, 'text/html').body
    .firstChild as HTMLElement;
}

type EventName =
  | 'mousedown'
  | 'touchstart'
  | 'mouseover'
  | 'mouseout'
  | 'focusin'
  | 'focusout';

function triggerListener(
  prefetcher: Root<unknown>,
  event: EventName,
  arg: Partial<FocusEvent>,
) {
  getListener(prefetcher, event)!.trigger('handler', arg);
}

function getListener(prefetcher: Root<unknown>, event: EventName) {
  return prefetcher.findAll(EventListener, {event})[0];
}
