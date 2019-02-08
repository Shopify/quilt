import * as React from 'react';
import {mount} from 'enzyme';

import {AsyncContext} from '../context';
import {Prepare} from '../Prepare';

import {createManager} from './utilities';

function MockComponent() {
  return null;
}

const defaultProps = {
  component: MockComponent,
  url: '/foo/bar',
};

describe('<Prepare />', () => {
  it('registers with the manager in context on mount', () => {
    const manager = createManager();
    const url = '/foo/bar';
    const mapUrlToProps = () => {};
    const spy = jest.spyOn(manager, 'register');

    mount(
      <AsyncContext.Provider value={manager}>
        <Prepare
          component={MockComponent}
          url={url}
          mapUrlToProps={mapUrlToProps}
        />
      </AsyncContext.Provider>,
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
    const manager = createManager();
    const spy = jest.fn();
    jest.spyOn(manager, 'register').mockImplementation(() => spy);

    const prepare = mount(
      <AsyncContext.Provider value={manager}>
        <Prepare {...defaultProps} />
      </AsyncContext.Provider>,
    );

    expect(spy).not.toHaveBeenCalled();

    prepare.unmount();

    expect(spy).toHaveBeenCalled();
  });
});
