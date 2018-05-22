import {ReactWrapper} from 'enzyme';

const mountedWrappers: ReactWrapper<any, any>[] = [];

export function addMountedWrapper(wrapper: ReactWrapper<any, any>) {
  mountedWrappers.push(wrapper);
}

/**
 * This unmounts all actively mounted Enzyme wrappers. Usually, you can
 * rely on us running this once for the entire suite after all each test
 * (and its nested hooks) have been run. However, in some cases you may
 * need to run this manually. This is most commonly needed when your
 * component uses timeouts/ animation frames that you mock out for tests,
 * and waiting until after you have restored those globals will lead
 * to their stored identifiers for the timeout or animation frame to
 * be invalid.
 */
export function unmountAllWrappers() {
  for (const wrapper of mountedWrappers) {
    wrapper.unmount();
  }

  mountedWrappers.length = 0;
}
