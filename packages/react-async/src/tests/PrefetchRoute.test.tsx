import * as React from 'react';
import {mount} from 'enzyme';

import {PrefetchContext} from '../context/prefetch';
import {PrefetchRoute} from '../PrefetchRoute';

import {createPrefetchManager} from './utilities';

function MockComponent() {
  return null;
}

const defaultProps = {
  component: MockComponent,
  url: '/foo/bar',
};

describe('<PrefetchRoute />', () => {
  it('registers with the manager in context on mount', () => {
    const manager = createPrefetchManager();
    const url = '/foo/bar';
    const mapUrlToProps = () => {};
    const spy = jest.spyOn(manager, 'register');

    mount(
      <PrefetchContext.Provider value={manager}>
        <PrefetchRoute
          component={MockComponent}
          url={url}
          mapUrlToProps={mapUrlToProps}
        />
      </PrefetchContext.Provider>,
    );

    expect(spy).toHaveBeenCalledWith(
      MockComponent,
      expect.objectContaining({
        url,
        mapUrlToProps,
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
