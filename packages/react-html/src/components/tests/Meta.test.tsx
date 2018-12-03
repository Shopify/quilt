import * as React from 'react';

import Manager from '../../manager';
import Meta from '../Meta';

import {mountWithManager} from './utilities';

describe('<Meta />', () => {
  it('adds a meta with the specified props', () => {
    const props = {content: 'foo'};
    const manager = new Manager();
    const spy = jest.spyOn(manager, 'addMeta');

    mountWithManager(<Meta {...props} />, manager);

    expect(spy).toHaveBeenCalledWith(props);
  });
});
