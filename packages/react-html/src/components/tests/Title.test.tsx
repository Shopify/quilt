import * as React from 'react';

import {HtmlManager} from '../../manager';
import {Title} from '../Title';

import {mountWithManager} from './utilities';

describe('<Title />', () => {
  it('adds a title with the passed children', () => {
    const title = 'Shopify';
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addTitle');

    mountWithManager(<Title>{title}</Title>, manager);

    expect(spy).toHaveBeenCalledWith(title);
  });
});
