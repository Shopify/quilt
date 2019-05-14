import React from 'react';
import {mount} from '@shopify/react-testing';
import {requestIdleCallback, animationFrame} from '@shopify/jest-dom-mocks';

import {OnIdle} from '../OnIdle';
import {UnsupportedBehavior} from '../types';

describe('<OnIdle />', () => {
  describe('supported', () => {
    beforeEach(() => {
      requestIdleCallback.mock();
    });

    afterEach(() => {
      requestIdleCallback.restore();
    });

    it('calls perform when the browser becomes idle', () => {
      const spy = jest.fn();
      const timeRemaining = 10;
      const didTimeout = false;

      mount(<OnIdle perform={spy} />);

      expect(spy).not.toHaveBeenCalled();

      requestIdleCallback.runIdleCallbacks(timeRemaining, didTimeout);

      expect(spy).toHaveBeenCalled();
    });

    it('cancels the idle callback when the component unmounts', () => {
      const spy = jest.fn();
      const onIdle = mount(<OnIdle perform={spy} />);

      onIdle.unmount();
      requestIdleCallback.runIdleCallbacks();

      expect(spy).not.toHaveBeenCalled();
    });

    it('cancels the idle callback when the perform prop changes', () => {
      const spyOne = jest.fn();
      const spyTwo = jest.fn();
      const onIdle = mount(<OnIdle perform={spyOne} />);

      onIdle.setProps({perform: spyTwo});
      requestIdleCallback.runIdleCallbacks();

      expect(spyOne).not.toHaveBeenCalled();
      expect(spyTwo).toHaveBeenCalled();
    });
  });

  describe('unsupported', () => {
    beforeEach(() => {
      requestIdleCallback.mockAsUnsupported();
      animationFrame.mock();
    });

    afterEach(() => {
      requestIdleCallback.restore();
      animationFrame.restore();
    });

    it('runs perform in an animation frame when requestIdleCallback is not supported', () => {
      const spy = jest.fn();
      mount(<OnIdle perform={spy} />);

      expect(spy).not.toHaveBeenCalled();

      animationFrame.runFrame();

      expect(spy).toHaveBeenCalled();
    });

    it('runs perform in immediately when requestIdleCallback is not supported and unsupportedBehavior is set to animation frame', () => {
      const spy = jest.fn();
      mount(
        <OnIdle
          perform={spy}
          unsupportedBehavior={UnsupportedBehavior.AnimationFrame}
        />,
      );

      expect(spy).not.toHaveBeenCalled();

      animationFrame.runFrame();

      expect(spy).toHaveBeenCalled();
    });

    it('runs perform in immediately when requestIdleCallback is not supported and unsupportedBehavior is set to immediate', () => {
      const spy = jest.fn();
      mount(
        <OnIdle
          perform={spy}
          unsupportedBehavior={UnsupportedBehavior.Immediate}
        />,
      );

      expect(spy).toHaveBeenCalled();
    });

    it('cancels the animation frame when the component unmounts', () => {
      const spy = jest.fn();
      const onIdle = mount(<OnIdle perform={spy} />);

      onIdle.unmount();
      animationFrame.runFrame();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
