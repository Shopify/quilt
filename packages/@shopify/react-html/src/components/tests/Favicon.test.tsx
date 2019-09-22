import React from 'react';

import {HtmlManager} from '../../manager';
import {Favicon} from '../Favicon';

import {mountWithManager} from './utilities';

describe('<Favicon />', () => {
  it('adds a link with the required favicon props and the href set to source', () => {
    const source = 'image.ico';
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addLink');

    mountWithManager(<Favicon source={source} />, manager);

    expect(spy).toHaveBeenCalledWith({
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: source,
    });
  });
});
