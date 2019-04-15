import * as React from 'react';
import ImportRemote from '@shopify/react-import-remote';

import {UniversalAnalytics} from './types';
import {getRootDomain, noop} from './utilities';

export interface Props {
  account: string;
  domain: string;
  nonce?: string;
  set?: {[key: string]: any};
  debug?: boolean;
  disableTracking?: boolean;
  onLoad?(analytics: UniversalAnalytics): void;
}

export const SETUP_SCRIPT = `
  window['GoogleAnalyticsObject'] = 'ga';
  window['ga'] = window['ga'] || function() {
    (window['ga'].q = window['ga'].q || []).push(arguments);
  };
  window['ga'].l = 1 * new Date();
`;

export const UNIVERSAL_GA_SCRIPT =
  'https://www.google-analytics.com/analytics.js';

export const UNIVERSAL_GA_DEBUG_SCRIPT =
  'https://www.google-analytics.com/analytics_debug.js';

export default function UniversalGoogleAnalytics({
  account,
  domain,
  nonce,
  set: setVariables = {},
  onLoad,
  debug,
  disableTracking,
}: Props) {
  const setAnalytics = React.useCallback(
    (googleAnalytics: UniversalAnalytics) => {
      const normalizedDomain = getRootDomain(domain);
      const options = {
        cookieDomain: normalizedDomain,
        legacyCookieDomain: normalizedDomain,
        allowLinker: true,
      };

      googleAnalytics('create', account, 'auto', options);

      if (debug || disableTracking) {
        // Prevent data being sent to Google
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging#testing_your_implementation_without_sending_hits
        googleAnalytics('set', 'sendHitTask', null);
      }

      for (const [key, value] of Object.entries(setVariables)) {
        googleAnalytics('set', key, value);
      }

      if (onLoad) {
        onLoad(googleAnalytics);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      domain,
      account,
      debug,
      disableTracking,
      onLoad,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.entries(setVariables).map(setVariable => setVariable.join()),
    ],
  );

  const source = debug ? UNIVERSAL_GA_DEBUG_SCRIPT : UNIVERSAL_GA_SCRIPT;

  return (
    <>
      <script
        id="google-analytics-universal-script"
        dangerouslySetInnerHTML={{__html: SETUP_SCRIPT}}
        nonce={nonce}
      />
      <ImportRemote
        preconnect
        source={source}
        nonce={nonce}
        getImport={getUniversalAnalytics}
        onError={noop}
        onImported={setAnalytics}
      />
    </>
  );
}

interface WindowWithUniversalAnalytics extends Window {
  ga: UniversalAnalytics;
}

function getUniversalAnalytics(window: Window) {
  return (window as WindowWithUniversalAnalytics).ga;
}
