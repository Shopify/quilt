import * as React from 'react';
import {mount} from 'enzyme';
import {intersectionObserver as intersectionObserverMock} from '@shopify/jest-dom-mocks';

import IntersectionObserver, {
  UnsupportedBehavior,
} from '../IntersectionObserver';

jest.mock('../utilities', () => ({
  isSupported: jest.fn(),
}));

const {isSupported} = require.requireMock('../utilities') as {
  isSupported: jest.Mock;
};

describe('<IntersectionObserver />', () => {
  beforeEach(() => {
    isSupported.mockClear();
    isSupported.mockImplementation(() => false);
    intersectionObserverMock.mock();
  });

  afterEach(() => {
    intersectionObserverMock.restore();
  });

  describe('wrapperComponent', () => {
    it('uses a div with display: contents by default', () => {
      const intersectionObserver = mount(<IntersectionObserver />);
      const child = intersectionObserver.childAt(0);
      expect(child.type()).toBe('div');
      expect(child.prop('style')).toMatchObject({display: 'contents'});
    });

    it('uses a custom element with display: contents by default', () => {
      const wrapperComponent = 'span';
      const intersectionObserver = mount(
        <IntersectionObserver wrapperComponent={wrapperComponent} />,
      );
      const child = intersectionObserver.childAt(0);

      expect(child.type()).toBe(wrapperComponent);
      expect(child.prop('style')).toMatchObject({display: 'contents'});
    });

    it('attaches the observer to the top-level node', () => {
      isSupported.mockReturnValue(true);

      const intersectionObserver = mount(<IntersectionObserver />);
      const child = intersectionObserver.childAt(0);
      const node = child.getDOMNode();

      expect(intersectionObserverMock.observers[0]).toHaveProperty(
        'target',
        node,
      );
    });
  });

  describe('children', () => {
    it('includes the children inside the top-level element', () => {
      const children = <div>Hello world</div>;
      const intersectionObserver = mount(
        <IntersectionObserver>{children}</IntersectionObserver>,
      );

      expect(intersectionObserver.childAt(0).contains(children)).toBe(true);
    });
  });

  describe('threshold', () => {
    beforeEach(() => {
      isSupported.mockReturnValue(true);
    });

    it('is used to create the IntersectionObserver', () => {
      const threshold = [0, 0.5, 1];

      mount(<IntersectionObserver threshold={threshold} />);

      expect(intersectionObserverMock.observers[0]).toMatchObject({
        options: {
          threshold,
        },
      });
    });
  });

  describe('rootMargin', () => {
    beforeEach(() => {
      isSupported.mockReturnValue(true);
    });

    it('is used to create the IntersectionObserver', () => {
      const rootMargin = '10%';

      mount(<IntersectionObserver rootMargin={rootMargin} />);

      expect(intersectionObserverMock.observers[0]).toMatchObject({
        options: {
          rootMargin,
        },
      });
    });
  });

  describe('root', () => {
    beforeEach(() => {
      isSupported.mockReturnValue(true);
    });

    it('uses an HTML element for the root IntersectionObserver option', () => {
      withHtmlElement(root => {
        mount(<IntersectionObserver root={root} />);

        expect(intersectionObserverMock.observers[0]).toMatchObject({
          options: {
            root,
          },
        });
      });
    });

    it('resolves a string to an HTML element for the root IntersectionObserver option', () => {
      withHtmlElement(root => {
        const id = 'MyRootElement';
        root.setAttribute('id', id);

        mount(<IntersectionObserver root={`#${id}`} />);

        expect(intersectionObserverMock.observers[0]).toMatchObject({
          options: {
            root,
          },
        });
      });
    });
  });

  describe('onIntersecting()', () => {
    it('is not called when IntersectionObserver is not supported and the unsupportedBehavior is to ignore', () => {
      isSupported.mockReturnValue(false);
      const spy = jest.fn();

      mount(
        <IntersectionObserver
          onIntersecting={spy}
          unsupportedBehavior={UnsupportedBehavior.Ignore}
        />,
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('is called immediately when IntersectionObserver is not supported and no unsupportedBehavior is set', () => {
      isSupported.mockReturnValue(false);
      const spy = jest.fn();

      mount(<IntersectionObserver onIntersecting={spy} />);

      expect(spy).toHaveBeenCalledWith({
        boundingClientRect: expect.any(Object),
        intersectionRatio: 1,
        intersectionRect: expect.any(Object),
        isIntersecting: true,
        rootBounds: expect.any(Object),
        target: expect.any(HTMLDivElement),
        time: expect.any(Number),
      });
    });

    it('is called immediately when IntersectionObserver is not supported and unsupportedBehavior is set to TreatAsIntersecting', () => {
      isSupported.mockReturnValue(false);
      const spy = jest.fn();

      mount(
        <IntersectionObserver
          onIntersecting={spy}
          unsupportedBehavior={UnsupportedBehavior.TreatAsIntersecting}
        />,
      );

      expect(spy).toHaveBeenCalledWith({
        boundingClientRect: expect.any(Object),
        intersectionRatio: 1,
        intersectionRect: expect.any(Object),
        isIntersecting: true,
        rootBounds: expect.any(Object),
        target: expect.any(HTMLDivElement),
        time: expect.any(Number),
      });
    });

    it('is called when the IntersectionObserver gets called with a non-0 intersectionRatio', () => {
      isSupported.mockReturnValue(true);
      const spy = jest.fn();
      const entry = {intersectionRatio: 0.2};

      mount(<IntersectionObserver onIntersecting={spy} />);

      intersectionObserverMock.simulate(entry);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining(entry));
    });

    it('is not called when the IntersectionObserver gets called with a 0 intersectionRatio', () => {
      isSupported.mockReturnValue(true);
      const spy = jest.fn();
      const entry = {intersectionRatio: 0};

      mount(<IntersectionObserver onIntersecting={spy} />);

      intersectionObserverMock.simulate(entry);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onNotIntersecting()', () => {
    it('is not called when the IntersectionObserver gets called with a non-0 intersectionRatio', () => {
      isSupported.mockReturnValue(true);
      const spy = jest.fn();
      const entry = {intersectionRatio: 0.2};

      mount(<IntersectionObserver onNotIntersecting={spy} />);

      intersectionObserverMock.simulate(entry);
      expect(spy).not.toHaveBeenCalled();
    });

    it('is called when the IntersectionObserver gets called with a 0 intersectionRatio', () => {
      isSupported.mockReturnValue(true);
      const spy = jest.fn();
      const entry = {intersectionRatio: 0};

      mount(<IntersectionObserver onNotIntersecting={spy} />);

      intersectionObserverMock.simulate(entry);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining(entry));
    });
  });

  describe('lifecycle', () => {
    beforeEach(() => {
      isSupported.mockReturnValue(true);
    });

    it('disconnects observers when unmounting', () => {
      const intersectionObserver = mount(<IntersectionObserver />);
      intersectionObserver.unmount();
      expect(intersectionObserverMock.observers).toHaveLength(0);
    });

    it('un-observes and re-observes when the root prop changes', () => {
      const intersectionObserver = mount(
        <IntersectionObserver threshold={0.5} />,
      );

      const threshold = 1;
      intersectionObserver.setProps({threshold});

      expect(intersectionObserverMock.observers).toHaveLength(1);
      expect(intersectionObserverMock.observers[0]).toHaveProperty(
        'options.threshold',
        threshold,
      );
    });

    it('un-observes and re-observes when the threshold changes', () => {
      withHtmlElement(firstRoot => {
        const intersectionObserver = mount(
          <IntersectionObserver root={firstRoot} />,
        );

        withHtmlElement(secondRoot => {
          intersectionObserver.setProps({root: secondRoot});

          expect(intersectionObserverMock.observers).toHaveLength(1);
          expect(intersectionObserverMock.observers[0]).toHaveProperty(
            'options.root',
            secondRoot,
          );
        });
      });
    });

    it('re-uses the same intersection observer when only the callbacks change', () => {
      const firstSpy = jest.fn();
      const secondSpy = jest.fn();
      const intersectionObserver = mount(
        <IntersectionObserver onIntersecting={firstSpy} />,
      );

      intersectionObserver.setProps({onIntersecting: secondSpy});
      intersectionObserverMock.simulate({intersectionRatio: 1});

      expect(firstSpy).not.toHaveBeenCalled();
      expect(secondSpy).toHaveBeenCalled();
    });

    it('re-uses the same intersection observer when the threshold changes to a new equivalent array', () => {
      const threshold = [0, 0.5, 1];
      const intersectionObserver = mount(
        <IntersectionObserver threshold={threshold} />,
      );

      const observer = intersectionObserverMock.observers[0];

      intersectionObserver.setProps({threshold: [...threshold]});

      expect(observer).toBe(intersectionObserverMock.observers[0]);
    });
  });
});

function withHtmlElement<T>(
  callback: (element: HTMLDivElement) => T | Promise<T>,
) {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const remove = () => element.remove();

  try {
    const result: any = callback(element);

    if (result == null || !('then' in result)) {
      remove();
      return result;
    } else {
      return (result as Promise<T>)
        .then(result => {
          remove();
          return result;
        })
        .catch(error => {
          remove();
          throw error;
        });
    }
  } catch (error) {
    remove();
    throw error;
  }
}
