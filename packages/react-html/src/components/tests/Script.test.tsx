import * as React from 'react';
import {mount} from 'enzyme';
import Script from '../Script';

describe('<Script />', () => {
  it('renders attributes', () => {
    const html = mount(
      <Script
        src="foo.js"
        integrity="00000000"
        crossOrigin="anonymous"
        defer
      />,
    );

    expect(html.find('script').props()).toMatchObject({
      src: 'foo.js',
      type: 'text/javascript',
      integrity: '00000000',
      crossOrigin: 'anonymous',
      defer: true,
    });
  });
});
