import * as React from 'react';
import {mount} from '@shopify/react-testing';
import {timer} from '@shopify/jest-dom-mocks';
import useTimeout from '../timeout';

describe('useTimeout', () => {
  function MockComponent({spy, delay}) {
    useTimeout(spy, delay);
    return null;
  }

  beforeEach(() => {
    timer.mock();
  });

  afterEach(() => {
    timer.restore();
  });

  it('does not call the handler immediately', () => {
    const spy = jest.fn();
    const delay = 1000;

    mount(<MockComponent delay={delay} spy={spy} />);

    expect(spy).not.toHaveBeenCalled();
  });

  it('calls the handler after the delay', () => {
    const spy = jest.fn();
    const delay = 1000;

    mount(<MockComponent delay={delay} spy={spy} />);

    timer.runAllTimers();

    expect(spy).toHaveBeenCalled();
  });

  it('unsubscribes timeouts when the passed in callback changes', () => {
    const spy = jest.fn();
    const delay = 1000;
    const newSpy = jest.fn();

    const wrapper = mount(<MockComponent delay={delay} spy={spy} />);

    wrapper.setProps({spy: newSpy});

    timer.runAllTimers();

    expect(spy).not.toHaveBeenCalled();
    expect(newSpy).toHaveBeenCalled();
  });
});
