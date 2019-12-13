import React from 'react';
import {mount} from '@shopify/react-testing';

import {useToggle} from '../toggle';

describe('useToggle', () => {
  function MockComponent({initialValueIsTrue = false}) {
    const {value, toggle, setTrue, setFalse} = useToggle(initialValueIsTrue);

    const activeText = value ? 'true' : 'false';

    return (
      <>
        <p>Value: {activeText}</p>
        <button type="button" id="toggle" onClick={toggle} />
        <button type="button" id="forceTrue" onClick={setTrue} />
        <button type="button" id="forceFalse" onClick={setFalse} />
      </>
    );
  }

  it('starts with an initial value', () => {
    const wrapperInitallyFalse = mount(<MockComponent />);
    expect(wrapperInitallyFalse).toContainReactText('Value: false');

    const wrapperInitallyTrue = mount(<MockComponent initialValueIsTrue />);
    expect(wrapperInitallyTrue).toContainReactText('Value: true');
  });

  it('toggles the value when the toggle callback is triggered', () => {
    const wrapper = mount(<MockComponent />);
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button', {id: 'toggle'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button', {id: 'toggle'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');
  });

  it('forces the value to true when the forceTrue callback is triggered', () => {
    const wrapper = mount(<MockComponent />);
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button', {id: 'forceTrue'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button', {id: 'forceTrue'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');
  });

  it('forces the value to false when the forceFalse callback is triggered', () => {
    const wrapper = mount(<MockComponent initialValueIsTrue />);
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button', {id: 'forceFalse'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button', {id: 'forceFalse'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');
  });
});
