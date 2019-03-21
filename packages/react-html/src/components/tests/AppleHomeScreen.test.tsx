import * as React from 'react';
import {mount, Root} from '@shopify/react-testing';
import {Props} from '@shopify/useful-types';

import Link from '../Link';
import Meta from '../Meta';

import AppleHomeScreen, {IconSize} from '../AppleHomeScreen';

describe('<AppleHomeScreen />', () => {
  it('renders a <Meta /> with `name="apple-mobile-web-app-capable" content="yes"` by default', () => {
    const appleHomeScreen = mount(<AppleHomeScreen />);

    expect(
      findMeta(appleHomeScreen, {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      }),
    ).not.toBeNull();
  });

  it('renders a <Meta /> with `name="apple-mobile-web-app-status-bar-style" content="black"` by default', () => {
    const appleHomeScreen = mount(<AppleHomeScreen />);

    expect(
      findMeta(appleHomeScreen, {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black',
      }),
    ).not.toBeNull();
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
      expect(appleHomeScreen.findAll(Link)[index].props).toMatchObject({
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

    expect(appleHomeScreen.find(Link)!.props).toMatchObject({
      href: startUpImage,
    });
  });
});

export function findMeta(wrapper: Root<any>, props: Props<typeof Meta>) {
  return wrapper.findWhere(element => {
    if (!element.is(Meta)) {
      return false;
    }

    const propsArray: (keyof typeof props)[] = Object.keys(props) as any;
    return (
      propsArray.filter(prop => element.prop(prop) === props[prop]).length ===
      propsArray.length
    );
  });
}
