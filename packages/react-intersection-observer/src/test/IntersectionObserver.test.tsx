import React from 'react';
import {mount} from '@shopify/react-testing';
import {intersectionObserver as intersectionObserverMock} from '@shopify/jest-dom-mocks';

import {IntersectionObserver} from '../IntersectionObserver';
import {UnsupportedBehavior} from '../types';

jest.mock('../utilities', () => ({
  isSupported: jest.fn(),
}));

const {isSupported} = jest.requireMock('../utilities') as {
  isSupported: jest.Mock;
};

const defaultProps = {onIntersectionChange() {}};

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
    it('uses a div by default', () => {
      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} />,
      );
      const child = intersectionObserver.children[0];
      expect(child).toHaveProperty('type', 'div');
    });

    it('uses a custom element', () => {
      const wrapperComponent = 'span';
      const intersectionObserver = mount(
        <IntersectionObserver
          {...defaultProps}
          wrapperComponent={wrapperComponent}
        />,
      );
      const child = intersectionObserver.children[0];
      expect(child).toHaveProperty('type', wrapperComponent);
    });

    it('attaches the observer to the top-level node', () => {
      isSupported.mockReturnValue(true);

      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} />,
      );
      const child = intersectionObserver.children[0];

      expect(intersectionObserverMock.observers[0]).toHaveProperty(
        'target',
        child.domNode,
      );
    });
  });

  describe('children', () => {
    it('includes the children inside the top-level element', () => {
      const id = 'HelloWorld';
      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps}>
          <div id={id} />
        </IntersectionObserver>,
      );

      expect(intersectionObserver.children[0]).toContainReactComponent('div', {
        id,
      });
    });
  });

  describe('threshold', () => {
    beforeEach(() => {
      isSupported.mockReturnValue(true);
    });

    it('is used to create the IntersectionObserver', () => {
      const threshold = [0, 0.5, 1];

      mount(<IntersectionObserver {...defaultProps} threshold={threshold} />);

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

      mount(<IntersectionObserver {...defaultProps} rootMargin={rootMargin} />);

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
        mount(<IntersectionObserver {...defaultProps} root={root} />);

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

        mount(<IntersectionObserver {...defaultProps} root={`#${id}`} />);

        expect(intersectionObserverMock.observers[0]).toMatchObject({
          options: {
            root,
          },
        });
      });
    });
  });

  describe('onIntersectionChange()', () => {
    it('is not called when IntersectionObserver is not supported and the unsupportedBehavior is to ignore', () => {
      isSupported.mockReturnValue(false);
      const spy = jest.fn();

      mount(
        <IntersectionObserver
          {...defaultProps}
          onIntersectionChange={spy}
          unsupportedBehavior={UnsupportedBehavior.Ignore}
        />,
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('is called immediately when IntersectionObserver is not supported and no unsupportedBehavior is set', () => {
      isSupported.mockReturnValue(false);
      const spy = jest.fn();

      mount(
        <IntersectionObserver {...defaultProps} onIntersectionChange={spy} />,
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

    it('is called immediately when IntersectionObserver is not supported and unsupportedBehavior is set to TreatAsIntersecting', () => {
      isSupported.mockReturnValue(false);
      const spy = jest.fn();

      mount(
        <IntersectionObserver
          {...defaultProps}
          onIntersectionChange={spy}
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

    it('is called when the IntersectionObserver is updated', () => {
      isSupported.mockReturnValue(true);
      const spy = jest.fn();
      const entry = {intersectionRatio: 0.2};

      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} onIntersectionChange={spy} />,
      );

      intersectionObserver.act(() => {
        intersectionObserverMock.simulate(entry);
      });

      expect(spy).toHaveBeenCalledWith(expect.objectContaining(entry));
    });
  });

  describe('lifecycle', () => {
    beforeEach(() => {
      isSupported.mockReturnValue(true);
    });

    it('disconnects observers when unmounting', () => {
      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} />,
      );
      intersectionObserver.unmount();
      expect(intersectionObserverMock.observers).toHaveLength(0);
    });

    it('un-observes and re-observes when the wrapperComponent changes', () => {
      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} wrapperComponent="div" />,
      );

      const wrapperComponent = 'span';
      intersectionObserver.setProps({wrapperComponent});

      expect(intersectionObserverMock.observers).toHaveLength(1);
      expect(intersectionObserverMock.observers[0]).toHaveProperty(
        'target',
        expect.any(HTMLSpanElement),
      );
    });

    it('un-observes and re-observes when the root changes', () => {
      withHtmlElement(firstRoot => {
        const intersectionObserver = mount(
          <IntersectionObserver {...defaultProps} root={firstRoot} />,
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

    it('re-uses the same intersection observer when only the callback changes', () => {
      const firstSpy = jest.fn();
      const secondSpy = jest.fn();
      const intersectionObserver = mount(
        <IntersectionObserver
          {...defaultProps}
          onIntersectionChange={firstSpy}
        />,
      );

      intersectionObserver.setProps({onIntersectionChange: secondSpy});
      intersectionObserver.act(() => {
        intersectionObserverMock.simulate({intersectionRatio: 1});
      });

      expect(firstSpy).not.toHaveBeenCalled();
      expect(secondSpy).toHaveBeenCalled();
    });

    it('un-observes and re-observes when the threshold changes', () => {
      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} threshold={0.5} />,
      );

      const threshold = 1;
      intersectionObserver.setProps({threshold});

      expect(intersectionObserverMock.observers).toHaveLength(1);
      expect(intersectionObserverMock.observers[0]).toHaveProperty(
        'options.threshold',
        threshold,
      );
    });

    it('re-uses the same intersection observer when the threshold changes to a new equivalent array', () => {
      const threshold = [0, 0.5, 1];
      const intersectionObserver = mount(
        <IntersectionObserver {...defaultProps} threshold={threshold} />,
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
