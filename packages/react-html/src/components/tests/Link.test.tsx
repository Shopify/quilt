import * as React from 'react';

import Manager from '../../manager';
import Link from '../Link';

import {mountWithManager} from './utilities';

describe('<Link />', () => {
  it('adds a link with the specified props', () => {
    const props = {src: 'foo'};
    const manager = new Manager();
    const spy = jest.spyOn(manager, 'addLink');

    mountWithManager(<Link {...props} />, manager);

    expect(spy).toHaveBeenCalledWith(props);
  });
});
