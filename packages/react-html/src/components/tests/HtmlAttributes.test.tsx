import React from 'react';

import {HtmlManager} from '../../manager';
import {HtmlAttributes} from '../HtmlAttributes';

import {mountWithManager} from './utilities';

describe('<HtmlAttributes />', () => {
  it('adds a link with the required preconnect props and the href set to source', () => {
    const props = {lang: 'es'};
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addHtmlAttributes');

    mountWithManager(<HtmlAttributes {...props} />, manager);

    expect(spy).toHaveBeenCalledWith(props);
  });
});
