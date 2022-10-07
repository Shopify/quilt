import {connected} from './root';

export function destroyAll() {
  const promises: Promise<void>[] = [];

  for (const wrapper of [...connected]) {
    promises.push(wrapper.destroy());
  }

  return Promise.all(promises);
}
