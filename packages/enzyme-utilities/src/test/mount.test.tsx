import * as React from 'react';
import {mount} from '..';
import {mount as enzymeMount} from 'enzyme';

import {addMountedWrapper} from '../wrappers';

jest.mock('../wrappers', () => ({
  addMountedWrapper: jest.fn(),
}));

jest.mock('enzyme', () => ({
  mount: jest.fn(),
}));

describe('mount', () => {
  it('calls the enzyme mount function', () => {
    const component = <p>test</p>;
    mount(component);

    expect(enzymeMount).toHaveBeenCalled();
  });

  it('calls addMountedWrapper', () => {
    const component = <p>test</p>;
    mount(component);

    expect(addMountedWrapper).toHaveBeenCalled();
  });
});
