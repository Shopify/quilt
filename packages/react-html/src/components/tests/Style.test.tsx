import * as React from 'react';
import {mount} from 'enzyme';
import Style from '../Style';

describe('<Style />', () => {
  it('renders attributes', () => {
    const html = mount(
      <Style href="foo.css" integrity="00000000" crossOrigin="anonymous" />,
    );

    expect(html.find('link').props()).toMatchObject({
      href: 'foo.css',
      type: 'text/css',
      rel: 'stylesheet',
      integrity: '00000000',
      crossOrigin: 'anonymous',
    });
  });
});
