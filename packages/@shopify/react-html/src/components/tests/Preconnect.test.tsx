import React from 'react';

import {HtmlManager} from '../../manager';
import {Preconnect} from '../Preconnect';

import {mountWithManager} from './utilities';

describe('<Preconnect />', () => {
  it('adds a link with the required preconnect props and the href set to source', () => {
    const source = 'image.ico';
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addLink');

    mountWithManager(<Preconnect source={source} />, manager);

    expect(spy).toHaveBeenCalledWith({
      rel: 'preconnect',
      href: source,
    });
  });
});
