import React from 'react';
import {mount} from '@shopify/react-testing';

import {useForceUpdate} from '../force-update';

describe('useForceUpdate', () => {
  it('updates the component when called', () => {
    const {wrapper, callback} = setup();

    expect(callback).toHaveBeenCalledTimes(1);

    wrapper.find('button')!.trigger('onClick');
    expect(callback).toHaveBeenCalledTimes(2);
    wrapper.find('button')!.trigger('onClick');
    expect(callback).toHaveBeenCalledTimes(3);
    wrapper.find('button')!.trigger('onClick');
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

function setup() {
  const callback = jest.fn();
  const wrapper = mount(<MockComponent callback={callback} />);

  return {callback, wrapper};
}
function MockComponent({callback}) {
  const forceUpdate = useForceUpdate();
  callback();

  return (
    <button type="button" onClick={forceUpdate}>
      Click me
    </button>
  );
}
