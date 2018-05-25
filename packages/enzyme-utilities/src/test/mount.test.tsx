import * as React from 'react';
import {setupMount} from '..';
import {mount as enzymeMount} from 'enzyme';

jest.mock('enzyme', () => ({
  mount: jest.fn(() => ({unmount: jest.fn()})),
}));

describe('mount', () => {
  it('calls the enzyme mount function', () => {
    const component = <p>test</p>;
    const {mount} = setupMount();
    mount(component);

    expect(enzymeMount).toHaveBeenCalled();
  });

  it('calls unmount on all mounted wrappers', () => {
    const component = <p>test</p>;
    const {mount, unmountAllWrappers} = setupMount();

    const wrapper = mount(component);

    unmountAllWrappers();
    expect(wrapper.unmount).toHaveBeenCalled();
  });

  describe('custom wrappers', () => {
    it('calls unmount on all added wrappers', () => {
      const wrapper1 = {unmount: jest.fn()};
      const wrapper2 = {unmount: jest.fn()};

      const {addMountedWrapper, unmountAllWrappers} = setupMount();

      addMountedWrapper(wrapper1 as any);
      addMountedWrapper(wrapper2 as any);

      expect(wrapper1.unmount).not.toHaveBeenCalled();
      expect(wrapper2.unmount).not.toHaveBeenCalled();

      unmountAllWrappers();

      expect(wrapper1.unmount).toHaveBeenCalledTimes(1);
      expect(wrapper2.unmount).toHaveBeenCalledTimes(1);
    });
  });
});
