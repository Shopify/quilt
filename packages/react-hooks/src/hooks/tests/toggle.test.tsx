import React from 'react';
import {mount} from '@shopify/react-testing';

import {useToggle} from '../toggle';

describe('useToggle', () => {
  function MockComponent({initialValueIsTrue = false}) {
    const [value, toggleValue] = useToggle(Boolean(initialValueIsTrue));

    const activeText = value ? 'true' : 'false';

    return (
      <>
        <p>Value: {activeText}</p>
        <button type="button" onClick={toggleValue} />
      </>
    );
  }

  it('starts with an initial value', () => {
    const wrapperInitallyFalse = mount(<MockComponent />);
    expect(wrapperInitallyFalse).toContainReactText('Value: false');

    const wrapperInitallyTrue = mount(<MockComponent initialValueIsTrue />);
    expect(wrapperInitallyTrue).toContainReactText('Value: true');
  });

  it('toggles the value when the callback is triggered', () => {
    const wrapper = mount(<MockComponent />);
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button').trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button').trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');
  });
});
