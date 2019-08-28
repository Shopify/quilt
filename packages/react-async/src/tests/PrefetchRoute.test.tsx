import React from 'react';
import {mount} from 'enzyme';

import {PrefetchContext} from '../context/prefetch';
import {PrefetchRoute} from '../PrefetchRoute';

import {createPrefetchManager} from './utilities';

function MockComponent() {
  return null;
}

const defaultProps = {
  render: () => <MockComponent />,
  path: '/foo/bar',
};

describe('<PrefetchRoute />', () => {
  it('registers with the manager in context on mount', () => {
    const manager = createPrefetchManager();
    const path = '/foo/bar';
    const render = () => <MockComponent />;
    const spy = jest.spyOn(manager, 'register');

    mount(
      <PrefetchContext.Provider value={manager}>
        <PrefetchRoute path={path} render={render} />
      </PrefetchContext.Provider>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path,
        render,
      }),
    );
  });

  it('unregisters on unmount', () => {
    const manager = createPrefetchManager();
    const spy = jest.fn();
    jest.spyOn(manager, 'register').mockImplementation(() => spy);

    const prepare = mount(
      <PrefetchContext.Provider value={manager}>
        <PrefetchRoute {...defaultProps} />
      </PrefetchContext.Provider>,
    );

    expect(spy).not.toHaveBeenCalled();

    prepare.unmount();

    expect(spy).toHaveBeenCalled();
  });
});
