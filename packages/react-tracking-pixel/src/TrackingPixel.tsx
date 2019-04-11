import * as React from 'react';
import {Preconnect} from '@shopify/react-html';

export interface Props {
  url: string;

  /**
   * Additional hosts to preconnect to. These should be hosts that
   * are connected to by the page that will be loaded in an iframe.
   */
  preconnectHosts?: string[];
}

const IFRAME_STYLES = {display: 'none'};

function TrackingPixel({url, preconnectHosts = []}: Props) {
  const preconnectHostsMarkup = preconnectHosts.map(preconnectHost => (
    <Preconnect key={preconnectHost} source={preconnectHost} />
  ));

  return (
    <>
      {preconnectHostsMarkup}
      <iframe
        src={url}
        sandbox="allow-scripts"
        title={url}
        scrolling="no"
        frameBorder={0}
        height={1}
        width={1}
        style={IFRAME_STYLES}
      />
    </>
  );
}

export default React.memo(TrackingPixel, (oldProps: Props, newProps: Props) => {
  const samePreconnectHosts =
    (oldProps.preconnectHosts == null && newProps.preconnectHosts == null) ||
    (newProps.preconnectHosts || []).join() ===
      (oldProps.preconnectHosts || []).join();

  return oldProps.url === newProps.url && samePreconnectHosts;
});
