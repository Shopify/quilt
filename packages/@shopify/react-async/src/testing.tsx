import React, {ReactElement} from 'react';
import {Arguments} from '@shopify/useful-types';
import {extract} from '@shopify/react-effect/server';

import {AsyncAssetManager, AsyncAssetContext} from './context/assets';

export async function getUsedAssets(
  element: ReactElement<unknown>,
  ...args: Arguments<AsyncAssetManager['used']>
) {
  const asyncAssets = new AsyncAssetManager();

  await extract(element, {
    decorate: element => (
      <AsyncAssetContext.Provider value={asyncAssets}>
        {element}
      </AsyncAssetContext.Provider>
    ),
  });

  return asyncAssets.used(...args);
}
