import * as React from 'react';
import {mount} from 'enzyme';

import Link from '../Link';
import Meta from '../Meta';
import {findMeta} from '../../tests/utilities';

import AppleHomeScreen, {IconSize} from '../AppleHomeScreen';

describe('<AppleHomeScreen />', () => {
  it('renders a <Meta /> with `name="apple-mobile-web-app-capable" content="yes"` by default', () => {
    const appleHomeScreen = mount(<AppleHomeScreen />);

    expect(
      findMeta(appleHomeScreen.find(Meta), {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      }),
    ).toHaveLength(1);
  });

  it('renders a <Meta /> with `name="apple-mobile-web-app-status-bar-style" content="black"` by default', () => {
    const appleHomeScreen = mount(<AppleHomeScreen />);

    expect(
      findMeta(appleHomeScreen.find(Meta), {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black',
      }),
    ).toHaveLength(1);
  });

  it('renders a <Link /> for each item in the icons prop', () => {
    const icons = [
      {
        size: IconSize.Large,
        url: '/path/to/large.png',
      },
      {
        size: IconSize.Medium,
        url: '/path/to/medium.png',
      },
      {
        size: IconSize.Small,
        url: '/path/to/small.png',
      },
    ];

    const appleHomeScreen = mount(<AppleHomeScreen icons={icons} />);

    icons.forEach(({size, url}, index) => {
      expect(
        appleHomeScreen
          .find(Link)
          .at(index)
          .props(),
      ).toMatchObject({
        sizes: `${size}x${size}`,
        href: url,
      });
    });
  });
  it('renders a <Link /> for the startUpImage prop', () => {
    const startUpImage = 'path/to/startup.png';
    const appleHomeScreen = mount(
      <AppleHomeScreen startUpImage={startUpImage} />,
    );

    expect(appleHomeScreen.find(Link).props()).toMatchObject({
      href: startUpImage,
    });
  });
});
