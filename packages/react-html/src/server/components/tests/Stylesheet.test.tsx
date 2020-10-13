import React from 'react';
import {mount} from '@shopify/react-testing';

import {Stylesheet} from '../Stylesheet';

describe('<Stylesheet />', () => {
  it('renders attributes', () => {
    const style = mount(
      <Stylesheet
        href="foo.css"
        integrity="00000000"
        crossOrigin="anonymous"
      />,
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
