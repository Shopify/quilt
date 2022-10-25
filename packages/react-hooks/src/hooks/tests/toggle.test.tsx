/* eslint-disable jest/no-standalone-expect */
import React from 'react';
import {mount} from '@shopify/react-testing';

import {useToggle} from '../toggle';

describe('useToggle', () => {
  function MockComponentObject({initialValueIsTrue = false}) {
    const {value, setTrue, setFalse, toggle} = useToggle(initialValueIsTrue);

    const activeText = value ? 'true' : 'false';

    return (
      <>
        <p>Value: {activeText}</p>
        <button type="button" id="forceTrue" onClick={setTrue} />
        <button type="button" id="forceFalse" onClick={setFalse} />
        <button type="button" id="toggle" onClick={toggle} />
      </>
    );
  }

  function MockComponentTuple({initialValueIsTrue = false}) {
    const [value, setTrue, setFalse, toggle] = useToggle(initialValueIsTrue);

    const activeText = value ? 'true' : 'false';

    return (
      <>
        <p>Value: {activeText}</p>
        <button type="button" id="forceTrue" onClick={setTrue} />
        <button type="button" id="forceFalse" onClick={setFalse} />
        <button type="button" id="toggle" onClick={toggle} />
      </>
    );
  }

  const tEach = it.each`
    Component              | format
    ${MockComponentObject} | ${'Object Return Format'}
    ${MockComponentTuple}  | ${'Tuple Return Format'}
  `;

  tEach('$format - starts with an initial value', ({Component}) => {
    const wrapperInitallyFalse = mount(<Component />);
    expect(wrapperInitallyFalse).toContainReactText('Value: false');

    const wrapperInitallyTrue = mount(<Component initialValueIsTrue />);
    expect(wrapperInitallyTrue).toContainReactText('Value: true');
  });

  tEach(
    '$format - toggles the value when the toggle callback is triggered',
    ({Component}) => {
      const wrapper = mount(<Component />);
      expect(wrapper).toContainReactText('Value: false');

      wrapper.find('button', {id: 'toggle'})!.trigger('onClick');
      expect(wrapper).toContainReactText('Value: true');

      wrapper.find('button', {id: 'toggle'})!.trigger('onClick');
      expect(wrapper).toContainReactText('Value: false');
    },
  );

  tEach(
    '$format - forces the value to true when the forceTrue callback is triggered',
    ({Component}) => {
      const wrapper = mount(<Component />);
      expect(wrapper).toContainReactText('Value: false');

      wrapper.find('button', {id: 'forceTrue'})!.trigger('onClick');
      expect(wrapper).toContainReactText('Value: true');

      wrapper.find('button', {id: 'forceTrue'})!.trigger('onClick');
      expect(wrapper).toContainReactText('Value: true');
    },
  );

  tEach(
    '$format - forces the value to false when the forceFalse callback is triggered',
    ({Component}) => {
      const wrapper = mount(<Component initialValueIsTrue />);
      expect(wrapper).toContainReactText('Value: true');

      wrapper.find('button', {id: 'forceFalse'})!.trigger('onClick');
      expect(wrapper).toContainReactText('Value: false');

      wrapper.find('button', {id: 'forceFalse'})!.trigger('onClick');
      expect(wrapper).toContainReactText('Value: false');
    },
  );
});
