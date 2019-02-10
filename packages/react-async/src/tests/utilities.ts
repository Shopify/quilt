import {PrefetchManager, Registration} from '../context/prefetch';
import {AsyncAssetManager} from '../context/assets';

export function createPrefetchManager(
  registered: Registration[] = [],
): PrefetchManager {
  return new PrefetchManager(registered);
}

export function createAsyncAssetManager() {
  return new AsyncAssetManager();
}
