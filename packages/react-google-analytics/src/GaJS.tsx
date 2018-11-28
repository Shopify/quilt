import * as React from 'react';
import ImportRemote from '@shopify/react-import-remote';

import {GaJSAnalytics} from './types';
import {getRootDomain, noop} from './utilities';

export interface Props {
  account: string;
  domain: string;
  devId?: string;
  allowLinker?: boolean;
  allowHash?: boolean;
  set?: any[][];
  onLoad?(analytics: GaJSAnalytics): void;
  disableTracking?: boolean;
}

export const SETUP_SCRIPT = `
  window['_gaq'] = window['_gaq'] || [];
`;

export function setupWithDebugScript(account: String) {
  // https://developers.google.com/analytics/devguides/collection/gajs/#disable
  return `window['ga-disable-${account}'] = true;${SETUP_SCRIPT}`;
}

export const GA_JS_SCRIPT = 'https://stats.g.doubleclick.net/dc.js';

export default class GaJSGoogleAnalytics extends React.PureComponent<
  Props,
  never
> {
  render() {
    const {account, disableTracking} = this.props;

    return (
      <>
        <script
          id="google-analytics-gtag-script"
          dangerouslySetInnerHTML={{
            __html: disableTracking
              ? setupWithDebugScript(account)
              : SETUP_SCRIPT,
          }}
        />
        <ImportRemote
          preconnect
          source={GA_JS_SCRIPT}
          getImport={getLegacyAnalytics}
          onError={noop}
          onImported={this.setAnalytics}
        />
      </>
    );
  }

  private setAnalytics = (googleAnalytics: GaJSAnalytics) => {
    const {
      account,
      domain,
      devId,
      allowLinker,
      allowHash,
      set: setVariables = [],
      onLoad,
    } = this.props;

    googleAnalytics.push(['_setAccount', account]);
    googleAnalytics.push(['_setDomainName', getRootDomain(domain)]);

    if (devId && devId.length > 0) {
      googleAnalytics.push(['_addDevId', devId]);
    }

    if (allowLinker !== undefined) {
      googleAnalytics.push(['_setAllowLinker', allowLinker]);
    }

    if (allowHash !== undefined) {
      googleAnalytics.push(['_setAllowHash', allowHash]);
    }

    for (const variable of setVariables) {
      googleAnalytics.push(['_setCustomVar', ...variable]);
    }

    if (onLoad) {
      onLoad(googleAnalytics);
    }
  };
}

interface WindowWithGaJSAnalytics extends Window {
  _gaq: GaJSAnalytics;
}

function getLegacyAnalytics(window: Window) {
  return (window as WindowWithGaJSAnalytics)._gaq;
}
