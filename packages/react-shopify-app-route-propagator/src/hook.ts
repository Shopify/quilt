import {useMemo, useEffect} from 'react';
import {ClientApplication} from '@shopify/app-bridge';
import {History} from '@shopify/app-bridge/actions';
import {LocationOrHref} from './types';

import {
  getSelfWindow,
  getTopWindow,
  getOrigin,
  MODAL_IFRAME_NAME,
} from './globals';

export default function useRoutePropagation(
  app: ClientApplication<any>,
  location: LocationOrHref,
) {
  const history = useMemo(() => History.create(app), [app]);

  useEffect(
    () => {
      const selfWindow = getSelfWindow();
      const topWindow = getTopWindow();

      const renderedInTheTopWindow = selfWindow === topWindow;
      const renderedInAModal = selfWindow.name === MODAL_IFRAME_NAME;

      if (renderedInTheTopWindow || renderedInAModal) {
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
