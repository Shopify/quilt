import * as React from 'react';

import {HtmlManager} from '../../manager';
import {BodyAttributes} from '../BodyAttributes';

import {mountWithManager} from './utilities';

describe('<BodyAttributes />', () => {
  it('adds a link with the required preconnect props and the href set to source', () => {
    const props = {lang: 'es'};
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addBodyAttributes');

    mountWithManager(<BodyAttributes {...props} />, manager);

    expect(spy).toHaveBeenCalledWith(props);
  });
});
