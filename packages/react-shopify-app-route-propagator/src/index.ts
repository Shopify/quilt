import React from 'react';

import {getSelfWindow, getTopWindow, getOrigin} from './globals';

export type LocationOrHref =
  | string
  | {search: string; hash: string; pathname: string};

export interface Props {
  location: LocationOrHref;
}

export const MODAL_IFRAME_NAME = 'app-modal-iframe';
export const REPLACE_STATE_MESSAGE = 'Shopify.API.replaceState';

export default class ReactShopifyAppRoutePropagator extends React.PureComponent<
  Props,
  never
> {
  componentDidMount() {
    this.propagateLocation();
  }

  componentDidUpdate() {
    this.propagateLocation();
  }

  propagateLocation() {
    const {location} = this.props;
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

    const data = JSON.stringify({
      message: REPLACE_STATE_MESSAGE,
      data: {location: `${pathname}${search}${hash}`},
    });

    topWindow.postMessage(data, '*');
  }

  render() {
    return null;
  }
}

function getNormalizedURL(location: LocationOrHref) {
  const origin = getOrigin();

  if (typeof location === 'string') {
    return new URL(location, origin);
  }

  const {pathname, search, hash} = location;
  return new URL(`${pathname}${search}${hash}`, origin);
}
