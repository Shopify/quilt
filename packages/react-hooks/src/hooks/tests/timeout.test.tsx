import React from 'react';
import {mount} from '@shopify/react-testing';
import {timer} from '@shopify/jest-dom-mocks';

import {useTimeout} from '../timeout';

const ONE_SECOND = 1000;
const HALF_A_SECOND = ONE_SECOND / 2;

describe('useTimeout', () => {
  beforeEach(() => {
    timer.mock();
  });

  afterEach(() => {
    timer.restore();
  });

  it('does not call the callback immediately', () => {
    const {callback} = setup({delay: ONE_SECOND});

    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the callback exactly once after the delay', () => {
    const {callback} = setup({delay: ONE_SECOND});

    timer.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('updates the callback when it changes', () => {
    const {callback, wrapper} = setup({delay: ONE_SECOND});

    const newCallback = jest.fn();
    wrapper.setProps({callback: newCallback});

    timer.runAllTimers();
    expect(newCallback).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('resets the timeout when the delay changes', () => {
    const {callback, wrapper} = setup({delay: HALF_A_SECOND});

    timer.runTimersToTime(HALF_A_SECOND);
    expect(callback).toHaveBeenCalledTimes(1);

    wrapper.setProps({delay: ONE_SECOND});

    timer.runTimersToTime(HALF_A_SECOND);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.runTimersToTime(HALF_A_SECOND);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

function setup({delay}) {
  const callback = jest.fn();
  const wrapper = mount(<MockComponent delay={delay} callback={callback} />);

  return {callback, wrapper};
}
function MockComponent({callback, delay}) {
  useTimeout(callback, delay);
  return null;
}
