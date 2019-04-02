import * as React from 'react';
import {mount} from '@shopify/react-testing';

import Link from '../Link';
import Preconnect from '../Preconnect';

describe('<Preconnect />', () => {
  it('renders a <Link /> with with rel set to dns-prefetch and preconnect', () => {
    const preconnect = mount(<Preconnect source="" />);
    expect(preconnect).toContainReactComponent(Link, {
      rel: 'dns-prefetch preconnect',
    });
  });

  it('renders a <Link /> with the href set to the passed source', () => {
    const source = '//my.domain.com';
    const preconnect = mount(<Preconnect source={source} />);
    expect(preconnect).toContainReactComponent(Link, {href: source});
  });
});
