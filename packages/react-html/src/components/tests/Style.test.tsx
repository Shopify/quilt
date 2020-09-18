import React from 'react';
import {mount} from '@shopify/react-testing';

import {Style} from '../Style';

describe('<Style />', () => {
  it('renders attributes', () => {
    const style = mount(
      <Style href="foo.css" integrity="00000000" crossOrigin="anonymous" />,
    );

    expect(style).toContainReactComponent('link', {
      href: 'foo.css',
      type: 'text/css',
      rel: 'stylesheet',
      integrity: '00000000',
      crossOrigin: 'anonymous',
    });
  });
});
