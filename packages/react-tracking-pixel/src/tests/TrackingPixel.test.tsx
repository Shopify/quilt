import * as React from 'react';
import {mount} from 'enzyme';
import Preconnect from '@shopify/react-preconnect';

import TrackingPixel from '../TrackingPixel';

describe('<TrackingPixel />', () => {
  const url = '/my/url/to/somewhere';

  it('renders a very tiny iframe', () => {
    const trackingPixel = mount(<TrackingPixel url={url} />);
    expect(trackingPixel.find('iframe').props()).toMatchObject({
      sandbox: 'allow-scripts',
      scrolling: 'no',
      frameBorder: 0,
      height: 1,
      width: 1,
    });
    const containerStyles = trackingPixel.find('iframe').get(0).props.style;
    expect(containerStyles).toHaveProperty('display', 'none');
  });

  describe('url', () => {
    it('is used as the src of the iframe', () => {
      const trackingPixel = mount(<TrackingPixel url={url} />);
      expect(trackingPixel.find('iframe').prop('src')).toBe(url);
    });
  });

  describe('preconnectHosts', () => {
    const preconnectHosts = ['foo.com', 'bar.com'];

    it('renders a Preconnect', () => {
      const trackingPixel = mount(
        <TrackingPixel url={url} preconnectHosts={preconnectHosts} />,
      );
      expect(trackingPixel.find(Preconnect).prop('hosts')).toEqual(
        preconnectHosts,
      );
    });
  });
});
