import * as React from 'react';
import {mount} from '@shopify/react-testing';
import {Preconnect} from '@shopify/react-html';

import TrackingPixel from '../TrackingPixel';

describe('<TrackingPixel />', () => {
  const url = '/my/url/to/somewhere';

  it('renders a very tiny iframe', () => {
    const trackingPixel = mount(<TrackingPixel url={url} />);
    expect(trackingPixel).toContainReactComponent('iframe', {
      sandbox: 'allow-scripts',
      scrolling: 'no',
      frameBorder: 0,
      height: 1,
      width: 1,
      style: {display: 'none'},
    });
  });

  describe('url', () => {
    it('is used as the src of the iframe', () => {
      const trackingPixel = mount(<TrackingPixel url={url} />);
      expect(trackingPixel).toContainReactComponent('iframe', {src: url});
    });
  });

  describe('preconnectHosts', () => {
    const preconnectHosts = ['foo.com', 'bar.com'];

    it('renders a Preconnect for each preconnect source', () => {
      const trackingPixel = mount(
        <TrackingPixel url={url} preconnectHosts={preconnectHosts} />,
      );

      const preconnects = trackingPixel.findAll(Preconnect);

      expect(preconnects).toHaveLength(preconnectHosts.length);

      for (const [index, preconnectHost] of Object.entries(preconnectHosts)) {
        expect(preconnects[index]).toHaveReactProps({source: preconnectHost});
      }
    });
  });
});
