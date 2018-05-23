import * as React from 'react';
import {createMount} from '..';
import {mount as enzymeMount} from 'enzyme';

jest.mock('../wrappers', () => ({
  addMountedWrapper: jest.fn(),
}));

jest.mock('enzyme', () => ({
  mount: jest.fn(),
}));

describe('mount', () => {
  it('calls the enzyme mount function', () => {
    const component = <p>test</p>;
    const mount = createMount(() => {});
    mount(component);

    expect(enzymeMount).toHaveBeenCalled();
  });

  it('calls addMountedWrapper', () => {
    const component = <p>test</p>;
    const onMountSpy = jest.fn();
    const mount = createMount(onMountSpy);
    mount(component);

    expect(onMountSpy).toHaveBeenCalled();
  });
});
