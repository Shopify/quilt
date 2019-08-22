import {connected} from './root';

export function destroyAll() {
  for (const wrapper of [...connected]) {
    wrapper.destroy();
  }
}
