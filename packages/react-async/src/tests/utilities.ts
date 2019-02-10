import {PrefetchManager, Record} from '../context/prefetch';
import {AsyncAssetManager} from '../context/assets';

export function createPrefetchManager(
  registered: Record<any>[] = [],
): PrefetchManager {
  return new PrefetchManager(registered);
}

export function createAsyncAssetManager() {
  return new AsyncAssetManager();
}
