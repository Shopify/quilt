import React from 'react';
import {mount} from '@shopify/react-testing';

import {useForcibleToggle} from '../forcible-toggle';

describe('useForcibleToggle', () => {
  function MockComponent({initialValue}) {
    const [value, {toggle, forceTrue, forceFalse}] = useForcibleToggle(
      initialValue,
    );

    return (
      <>
        <p>Value: {value ? 'true' : 'false'}</p>
        <button id="toggle" onClick={toggle} />
        <button id="forceTrue" onClick={forceTrue} />
        <button id="forceFalse" onClick={forceFalse} />
      </>
    );
  }

  it('starts with an initial value', () => {
    const wrapperInitallyFalse = mount(<MockComponent initialValue={false} />);
    expect(wrapperInitallyFalse).toContainReactText('Value: false');

    const wrapperInitallyTrue = mount(<MockComponent initialValue={true} />);
    expect(wrapperInitallyTrue).toContainReactText('Value: true');
  });

  it('toggles the value when the toggle callback is triggered', () => {
    const wrapper = mount(<MockComponent initialValue={false} />);
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button', {id: 'toggle'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button', {id: 'toggle'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');
  });

  it('forces the value to true when the forceTrue callback is triggered', () => {
    const wrapper = mount(<MockComponent initialValue={false} />);
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button', {id: 'forceTrue'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button', {id: 'forceTrue'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: true');
  });

  it('forces the value to false when the forceFalse callback is triggered', () => {
    const wrapper = mount(<MockComponent initialValue={true} />);
    expect(wrapper).toContainReactText('Value: true');

    wrapper.find('button', {id: 'forceFalse'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');

    wrapper.find('button', {id: 'forceFalse'}).trigger('onClick');
    expect(wrapper).toContainReactText('Value: false');
  });
});
