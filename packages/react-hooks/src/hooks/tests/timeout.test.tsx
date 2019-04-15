import * as React from 'react';
import {mount} from '@shopify/react-testing';
import {timer} from '@shopify/jest-dom-mocks';
import useTimeout from '../timeout';

describe('useTimout', () => {
  function MockComponent({spy}) {
    useTimeout(spy, 1000);
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

    mount(<MockComponent spy={spy} />);

    expect(spy).not.toHaveBeenCalled();
  });

  it('calls the handler after the delay', () => {
    const spy = jest.fn();

    mount(<MockComponent spy={spy} />);

    timer.runAllTimers();

    expect(spy).toHaveBeenCalled();
  });
});
