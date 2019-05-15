import {useContext} from 'react';
import {useServerEffect} from '@shopify/react-effect';
import {AsyncAssetContext} from './context/assets';

export function useAsyncAsset(id?: string) {
  const assets = useContext(AsyncAssetContext);

  useServerEffect(() => {
    if (assets && id) {
      assets.markAsUsed(id);
    }
  });
}
