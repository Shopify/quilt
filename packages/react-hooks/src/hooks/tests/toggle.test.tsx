import React from 'react';
import {mount} from '@shopify/react-testing';

import {useToggle} from '../toggle';

describe('useToggle', () => {
  function MockComponent({initialValue}) {
    const [value, toggleValue] = useToggle(initialValue);

    return (
      <>
        <p>Value: {value ? 'true' : 'false'}</p>
        <button onClick={toggleValue} />
      </>
    );
  }

  it('starts with an initial value', () => {
    const wrapperInitallyFalse = mount(<MockComponent initialValue={false} />);
    expect(wrapperInitallyFalse).toContainReactText('Value: false');

    const wrapperInitallyTrue = mount(<MockComponent initialValue={true} />);
    expect(wrapperInitallyTrue).toContainReactText('Value: true');
  });

  it('toggles the value when the callback is triggered', () => {
    const wrapper = mount(<MockComponent initialValue={false} />);
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button').trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button').trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');
  });
});
