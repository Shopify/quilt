import React from 'react';

import {HtmlManager} from '../../manager';
import {InlineStyle} from '../InlineStyle';

import {mountWithManager} from './utilities';

describe('<InlineStyle />', () => {
  it('adds a style with the specified props', () => {
    const props = {children: '.foo {color:red}'};
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addInlineStyle');

    mountWithManager(<InlineStyle {...props} />, manager);

    expect(spy).toHaveBeenCalledWith(props);
  });
});
