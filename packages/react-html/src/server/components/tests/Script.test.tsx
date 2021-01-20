import React from 'react';
import {mount} from '@shopify/react-testing';

import {Script} from '../Script';

describe('<Script />', () => {
  it('renders attributes', () => {
    const script = mount(
      <Script
        src="foo.js"
        integrity="00000000"
        crossOrigin="anonymous"
        defer
      />,
    );

    expect(script).toContainReactComponent('script', {
      src: 'foo.js',
      integrity: '00000000',
      crossOrigin: 'anonymous',
      defer: true,
    });
  });

  it('defaults to text/javascript', () => {
    const script = mount(<Script src="foo.js" />);

    expect(script).toContainReactComponent('script', {
      type: 'text/javascript',
    });
  });

  it('renders provided types', () => {
    const moduleScript = mount(<Script src="foo.js" type="module" />);
    expect(moduleScript).toContainReactComponent('script', {
      type: 'module',
    });
  });
});
