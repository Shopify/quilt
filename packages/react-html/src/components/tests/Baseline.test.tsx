import * as React from 'react';
import {mount} from 'enzyme';
import {findMeta} from '../../tests/utilities';
import Meta from '../Meta';
import Favicon from '../Favicon';
import Title from '../Title';

import Baseline from '../Baseline';

describe('<Baseline />', () => {
  it('renders a <Meta /> with `charSet="utf-8"` by default', () => {
    const baseline = mount(<Baseline />);

    expect(
      findMeta(baseline.find(Meta), {
        charSet: 'utf-8',
      }),
    ).toHaveLength(1);
  });

  it('renders a <Meta /> with `httpEquiv="X-UA-Compatible" content="IE=edge"` by default', () => {
    const baseline = mount(<Baseline />);

    expect(
      findMeta(baseline.find(Meta), {
        httpEquiv: 'X-UA-Compatible',
        content: 'IE=edge',
      }),
    ).toHaveLength(1);
  });

  it('renders a <Meta /> with `name="referrer" content="never"` by default', () => {
    const baseline = mount(<Baseline />);

    expect(
      findMeta(baseline.find(Meta), {
        name: 'referrer',
        content: 'never',
      }),
    ).toHaveLength(1);
  });

  it('renders a <Favicon /> with the source set to the favicon prop', () => {
    const favicon = 'favicon.ico';
    const baseline = mount(<Baseline favicon={favicon} />);

    expect(baseline.find(Favicon).prop('source')).toEqual(favicon);
  });

  it('renders a <Title /> with the title prop as its children', () => {
    const title = 'Shopify';
    const baseline = mount(<Baseline title={title} />);

    expect(baseline.find(Title).prop('children')).toEqual(title);
  });
});
