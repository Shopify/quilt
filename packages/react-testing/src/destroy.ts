import {connected} from './root';

export function destroyAll() {
  for (const wrapper of [...connected]) {
    wrapper.destroy();
  }
}

export async function cleanup() {
  for (const wrapper of [...connected]) {
    await wrapper.cleanup();
  }
}
