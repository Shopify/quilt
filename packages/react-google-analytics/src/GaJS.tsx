import React from 'react';
import ImportRemote from '@shopify/react-import-remote';

import {GaJSAnalytics} from './types';
import {getRootDomain} from './utilities';

export interface Props {
  account: string;
  domain: string;
  nonce?: string;
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

export function setupWithDebugScript(account: string) {
  // https://developers.google.com/analytics/devguides/collection/gajs/#disable
  return `window['ga-disable-${account}'] = true;${SETUP_SCRIPT}`;
}

export const GA_JS_SCRIPT = 'https://stats.g.doubleclick.net/dc.js';

export default function GaJSGoogleAnalytics({
  account,
  domain,
  disableTracking,
  nonce,
  devId,
  allowLinker,
  allowHash,
  set: setVariables = [],
  onLoad,
}: Props) {
  const setAnalytics = React.useCallback(
    (googleAnalytics: GaJSAnalytics) => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      account,
      domain,
      devId,
      allowLinker,
      allowHash,
      onLoad,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...setVariables.map(setArray => setArray.join()),
    ],
  );

  return (
    <>
      <script
        id="google-analytics-gtag-script"
        dangerouslySetInnerHTML={{
          __html: disableTracking
            ? setupWithDebugScript(account)
            : SETUP_SCRIPT,
        }}
        nonce={nonce}
      />
      <ImportRemote
        preconnect
        source={GA_JS_SCRIPT}
        nonce={nonce}
        getImport={getLegacyAnalytics}
        onImported={setAnalytics}
      />
    </>
  );
}

interface WindowWithGaJSAnalytics extends Window {
  _gaq: GaJSAnalytics;
}

function getLegacyAnalytics(window: Window) {
  return (window as WindowWithGaJSAnalytics)._gaq;
}
