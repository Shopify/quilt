import * as React from 'react';
import {mount} from 'enzyme';

import Link from '../Link';
import Favicon from '../Favicon';

describe('<Favicon />', () => {
  it('renders a <Link /> with default favicon props', () => {
    const favicon = mount(<Favicon source="" />);
    expect(favicon.find(Link).props()).toMatchObject({
      rel: 'shortcut icon',
      type: 'image/x-icon',
    });
  });

  it('renders a <Link /> with the href set to the passed source', () => {
    const source = 'my-icon.ico';
    const favicon = mount(<Favicon source={source} />);
    expect(favicon.find(Link).prop('href')).toBe(source);
  });
});
