import * as React from 'react';
import {mount} from 'enzyme';
import {withRouter, WithRouterProps} from 'react-router';

import {createRouter, createLocation, setDefaultPathname} from '..';

function TestPage({location}: WithRouterProps) {
  return <p>{location.pathname}</p>;
}

const SomePage = withRouter(TestPage) as React.ComponentType;

describe('jest-mock-router', () => {
  describe('createLocation', () => {
    it('supports a mock pathname', () => {
      const somePage = mount(<SomePage />, {
        context: {
          router: createRouter({
            location: createLocation({
              pathname: 'test',
            }),
          }),
        },
      });

      expect(somePage.find('p').text()).toBe('test');
    });
  });

  describe('defaultPathname', () => {
    afterEach(() => {
      // reset to initial default
      setDefaultPathname('/');
    });

    it('starts off as "/"', () => {
      const somePage = mount(<SomePage />, {
        context: {
          router: createRouter({
            location: createLocation(),
          }),
        },
      });

      expect(somePage.find('p').text()).toBe('/');
    });

    it('can be modified using setDefaultPathname', () => {
      setDefaultPathname('/admin');

      const somePage = mount(<SomePage />, {
        context: {
          router: createRouter({
            location: createLocation(),
          }),
        },
      });

      expect(somePage.find('p').text()).toBe('/admin');
    });
  });
});
