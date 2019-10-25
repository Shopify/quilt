import {useMemo, useEffect} from 'react';
import {Context, ClientApplication} from '@shopify/app-bridge';
import {History} from '@shopify/app-bridge/actions';
import {LocationOrHref} from './types';

import {getSelfWindow, getTopWindow, getOrigin} from './globals';

export default function useRoutePropagation(
  app: ClientApplication<any>,
  location: LocationOrHref,
) {
  const history = useMemo(() => History.create(app), [app]);

  useEffect(
    () => {
      async function updateHistory() {
        const selfWindow = getSelfWindow();
        const topWindow = getTopWindow();

        const renderedInTheTopWindow = selfWindow === topWindow;

        const renderedAsMainApp = await app
          .getState('context')
          .then((context: Context) => {
            return context === Context.Main;
          });

        if (renderedInTheTopWindow || !renderedAsMainApp) {
          return;
        }

        const normalizedLocation = getNormalizedURL(location);

        /*
      We delete this param that ends up unnecassarily stuck on
      the iframe due to oauth when propagating up.
    */
        normalizedLocation.searchParams.delete('hmac');

        const {pathname, search, hash} = normalizedLocation;
        const locationStr = `${pathname}${search}${hash}`;

        history.dispatch(History.Action.REPLACE, locationStr);
      }

      updateHistory();
    },
    [history, location],
  );
}

function getNormalizedURL(location: LocationOrHref) {
  const origin = getOrigin();

  if (typeof location === 'string') {
    return new URL(location, origin);
  }

  const {pathname, search, hash} = location;
  return new URL(`${pathname}${search}${hash}`, origin);
}
