import * as React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {clock} from '@shopify/jest-dom-mocks';
import {trigger} from '@shopify/enzyme-utilities';

import {EventListener} from '../EventListener';
import {Prefetcher, HOVER_DELAY_MS} from '../Prefetcher';
import {createManager} from './utilities';

jest.mock('../EventListener', () => ({
  EventListener() {
    return null;
  },
}));

function MockComponent(_props: {name?: string}) {
  return null;
}

const url = '/mock/url';

describe('<Prefetch />', () => {
  beforeEach(() => {
    clock.mock();
  });

  afterEach(() => {
    clock.restore();
  });

  it('does not prefetch anything by default', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);
    expect(prefetcher).not.toContainReact(<MockComponent />);
  });

  it('prefetches a component when hovering over an element with a matching href for enough time', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'mouseover', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    expect(prefetcher).not.toContainReact(<MockComponent />);

    clock.tick(HOVER_DELAY_MS + 1);
    prefetcher.update();

    expect(prefetcher).toContainReact(<MockComponent />);
  });

  it('prefetches a component when focusing on an element with a matching href for enough time', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'focusin', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    expect(prefetcher).not.toContainReact(<MockComponent />);

    clock.tick(HOVER_DELAY_MS + 1);
    prefetcher.update();

    expect(prefetcher).toContainReact(<MockComponent />);
  });

  it('prefetches a component when clicking on an element with a matching href immediately', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    expect(prefetcher).toContainReact(<MockComponent />);
  });

  it('does not prefetch a component when mousing over, then out, of an element with a matching href', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'mouseover', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    triggerListener(prefetcher, 'mouseout', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    clock.tick(HOVER_DELAY_MS + 1);
    prefetcher.update();

    expect(prefetcher).not.toContainReact(<MockComponent />);
  });

  it('still prefetches a component when mousing over, then out into a child, of an element with a matching href', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);
    const element = mockElement(`<a href="${url}"><div></div></a>`);

    triggerListener(prefetcher, 'mouseover', {
      target: element,
    });

    triggerListener(prefetcher, 'mouseout', {
      target: element,
      relatedTarget: element.firstChild,
    });

    clock.tick(HOVER_DELAY_MS + 1);
    prefetcher.update();

    expect(prefetcher).toContainReact(<MockComponent />);
  });

  it('does not prefetch a component when focusing in, then out, of an element with a matching href', () => {
    const manager = createManager([{component: MockComponent, url}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'focusin', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    triggerListener(prefetcher, 'focusout', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    clock.tick(HOVER_DELAY_MS + 1);
    prefetcher.update();

    expect(prefetcher).not.toContainReact(<MockComponent />);
  });

  it('prefetches a components with matching regex URLs', () => {
    const manager = createManager([{component: MockComponent, url: /.*/}]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    expect(prefetcher).toContainReact(<MockComponent />);
  });

  it('prefetches multiple matching components', () => {
    function AnotherPrefetch() {
      return null;
    }

    const manager = createManager([
      {component: MockComponent, url: /.*/},
      {component: AnotherPrefetch, url},
    ]);
    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    expect(prefetcher).toContainReact(<MockComponent />);
    expect(prefetcher).toContainReact(<AnotherPrefetch />);
  });

  it('maps the url to props when a prop mapper is included', () => {
    const props = {name: 'Gord'};
    const spy = jest.fn(() => props);
    const manager = createManager([
      {component: MockComponent, url: /.*/, mapUrlToProps: spy},
    ]);

    const prefetcher = mount(<Prefetcher manager={manager} />);

    triggerListener(prefetcher, 'mousedown', {
      target: mockElement(`<a href="${url}"></a>`),
    });

    expect(spy).toHaveBeenCalledWith(url);
    expect(prefetcher).toContainReact(<MockComponent {...props} />);
  });
});

function mockElement(markup: string) {
  return new DOMParser().parseFromString(markup, 'text/html').body
    .firstChild as HTMLElement;
}

type Event = 'mousedown' | 'mouseover' | 'mouseout' | 'focusin' | 'focusout';

function triggerListener(
  prefetcher: ReactWrapper,
  event: Event,
  ...args: any[]
) {
  trigger(getListener(prefetcher, event), 'handler', ...args);
  prefetcher.update();
}

function getListener(prefetcher: ReactWrapper, event: Event) {
  return prefetcher.find(EventListener).filter({event});
}
