import * as React from 'react';
import {mount} from '@shopify/react-testing';

import Meta from '../Meta';
import Responsive from '../Responsive';

describe('<Responsive />', () => {
  it('renders a <Meta /> with the content attribute set to `width=device-width, initial-scale=1, viewport-fit=cover` by default', () => {
    const responsive = mount(<Responsive />);
    expect(responsive).toContainReactComponent(Meta, {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    });
  });

  it('renders a <Meta /> without `viewport-fit=cover` in the content attribute when coverNotch is false', () => {
    const responsive = mount(<Responsive coverNotch={false} />);

    expect(responsive).not.toContainReactComponent(Meta, {
      content: expect.stringMatching(/viewport-fit=cover/),
    });
  });

  it('renders a <Meta /> with `user-scalable=no` in the content attribute when allowPinchToZoom is false', () => {
    const responsive = mount(<Responsive allowPinchToZoom={false} />);

    expect(responsive).toContainReactComponent(Meta, {
      content: expect.stringMatching(/user-scalable=no/),
    });
  });
});
