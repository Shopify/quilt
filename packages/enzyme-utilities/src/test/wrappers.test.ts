import {wrappers} from '..';

describe('wrappers', () => {
  it('calls unmount on all wrappers', () => {
    const wrapper1 = {unmount: jest.fn()};
    const wrapper2 = {unmount: jest.fn()};

    const {addMountedWrapper, unmountAllWrappers} = wrappers();

    addMountedWrapper(wrapper1 as any);
    addMountedWrapper(wrapper2 as any);

    expect(wrapper1.unmount).not.toHaveBeenCalled();
    expect(wrapper2.unmount).not.toHaveBeenCalled();

    unmountAllWrappers();

    expect(wrapper1.unmount).toHaveBeenCalledTimes(1);
    expect(wrapper2.unmount).toHaveBeenCalledTimes(1);
  });
});
