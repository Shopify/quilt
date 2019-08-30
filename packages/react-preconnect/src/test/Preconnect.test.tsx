import React from 'react';
import {mount} from 'enzyme';
import {Helmet} from 'react-helmet';
import Preconnect from '../Preconnect';

jest.mock('react-helmet', () => ({
  Helmet: function Helmet({children}: {children?: React.ReactNode}) {
    return children || null;
  },
}));

describe('<Preconnect />', () => {
  it('renders a protocol-relative preconnect link in a Helmet component', () => {
    const host = ['foo.com'];
    const preconnect = mount(<Preconnect hosts={host} />);
    expect(
      preconnect
        .find(Helmet)
        .find('link')
        .filter({
          rel: 'dns-prefetch preconnect',
          href: `//${host}`,
        }),
    ).toHaveLength(1);
  });

  it('renders an array of hosts as preconnect links', () => {
    const hosts = ['foo.com', 'bar.com'];
    const preconnect = mount(<Preconnect hosts={hosts} />);
    expect(preconnect.find(Helmet).find('link')).toHaveLength(2);

    hosts.forEach(host =>
      expect(
        preconnect
          .find(Helmet)
          .find('link')
          .filter({
            href: `//${host}`,
          }),
      ).toHaveLength(1),
    );
  });
});
