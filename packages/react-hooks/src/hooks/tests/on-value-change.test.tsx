import * as React from 'react';
import {mount} from '@shopify/react-testing';

import useOnValueChange from '../on-value-change';

describe('useOnValueChnge', () => {
  function MockComponent({value, spy}) {
    useOnValueChange(value, spy);
    return null;
  }

  it('does not call the onChange handler by default', () => {
    const spy = jest.fn();
    const initialValue = 'initial';

    mount(<MockComponent value={initialValue} spy={spy} />);

    expect(spy).not.toHaveBeenCalled();
  });

  it('calls the onChange handler when the initial value and the changed value changes', () => {
    const spy = jest.fn();
    const initialValue = 'initial';
    const value = 'changed';
    const wrapper = mount(<MockComponent value={initialValue} spy={spy} />);

    wrapper.setProps({value});

    expect(spy).toHaveBeenCalledWith(value, initialValue);
  });

  it(`doesn't call onChange handler when the initial value and the changed value changes`, () => {
    const spy = jest.fn();
    const initialValue = 'initial';

    const wrapper = mount(<MockComponent value={initialValue} spy={spy} />);

    wrapper.forceUpdate();

    expect(spy).not.toHaveBeenCalled();
  });
});
