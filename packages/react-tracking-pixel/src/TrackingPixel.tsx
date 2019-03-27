import * as React from 'react';
import Preconnect from '@shopify/react-preconnect';

export interface Props {
  url: string;

  /**
   * Additional hosts to preconnect to. These should be hosts that
   * are connected to by the page that will be loaded in an iframe.
   */
  preconnectHosts?: string[];
}

export default React.memo(function TrackingPixel(props: Props) {
  const {url, preconnectHosts} = props;
  const styles = {
    display: 'none',
  };

  const preconnectHostsMarkup = preconnectHosts ? (
    <Preconnect hosts={preconnectHosts} />
  ) : null;

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
        style={styles}
      />
    </>
  );
});
