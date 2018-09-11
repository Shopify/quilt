import * as React from 'react';
import isEqual from 'lodash/isEqual';
import Preconnect from '@shopify/react-preconnect';
import * as styles from './TrackingPixel.scss';

export interface Props {
  url: string;

  /**
   * Additional hosts to preconnect to. These should be hosts that
   * are connected to by the page that will be loaded in an iframe.
   */
  preconnectHosts?: string[];
}

export default class TrackingPixel extends React.Component<Props, never> {
  shouldComponentUpdate(nextProps: Props) {
    return isEqual(nextProps, this.props);
  }

  render() {
    const {url, preconnectHosts} = this.props;

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
          className={styles.TrackingPixel}
        />
      </>
    );
  }
}
