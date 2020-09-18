import React, {useState} from 'react';
import {mount} from '@shopify/react-testing';
import {timer} from '@shopify/jest-dom-mocks';

import {useDebouncedValue} from '../debounced';

const ONE_SECOND = 1000;
const HALF_A_SECOND = ONE_SECOND / 2;

describe('useDebouncedValue', () => {
  beforeEach(() => {
    timer.mock();
  });

  afterEach(() => {
    timer.restore();
  });

  it('returns the first value when called once', () => {
    const wrapper = setup({delay: ONE_SECOND, value: 'something'});

    expect(wrapper).toContainReactText('something');
  });

  it('returns the debounced value', () => {
    const initialValue = 'something';
    const newValue = 'change';
    const wrapper = setup({delay: ONE_SECOND, value: initialValue});

    wrapper.setProps({value: newValue});

    wrapper.act(() => {
      timer.runTimersToTime(HALF_A_SECOND);
    });

    expect(wrapper).toContainReactText(initialValue);

    wrapper.act(() => {
      timer.runTimersToTime(ONE_SECOND);
    });

    expect(wrapper).toContainReactText(newValue);
  });
});

function setup({delay, value}) {
  const wrapper = mount(<MockComponent delay={delay} value={value} />);

  return wrapper;
}

function MockComponent({value, delay}) {
  const debouncedValue = useDebouncedValue(value, {timeoutMs: delay});
  return <div>{debouncedValue}</div>;
}
