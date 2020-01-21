import React from 'react';
import {mount} from '@shopify/react-testing';
import {timer} from '@shopify/jest-dom-mocks';

import {useInterval} from '../interval';

const ONE_SECOND = 1000;
const HALF_A_SECOND = ONE_SECOND / 2;

describe('useInterval', () => {
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

  it('repeately calls the callback after the delay', () => {
    const {callback} = setup({delay: ONE_SECOND});

    timer.runTimersToTime(ONE_SECOND);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.runTimersToTime(ONE_SECOND);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('updates the callback when it changes', () => {
    const {callback, wrapper} = setup({delay: ONE_SECOND});

    const newCallback = jest.fn();
    wrapper.setProps({callback: newCallback});

    timer.runTimersToTime(ONE_SECOND);
    expect(newCallback).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('sets no interval if the delay provided is null', () => {
    const {callback} = setup({delay: null});

    timer.runTimersToTime(ONE_SECOND);

    expect(callback).not.toHaveBeenCalled();
  });

  it('clears existing interval if the new delay is null', () => {
    const {callback, wrapper} = setup({delay: ONE_SECOND});

    wrapper.setProps({delay: null});

    timer.runTimersToTime(ONE_SECOND);
    expect(callback).not.toHaveBeenCalled();
  });

  it('continues to respect the delay after the callback changes', () => {
    const {callback, wrapper} = setup({delay: ONE_SECOND});

    timer.runTimersToTime(HALF_A_SECOND);
    expect(callback).not.toHaveBeenCalled();

    const newCallback = jest.fn();
    wrapper.setProps({callback: newCallback});

    timer.runTimersToTime(HALF_A_SECOND);
    expect(newCallback).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('resets the interval when the delay changes', () => {
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
  useInterval(callback, delay);
  return null;
}
