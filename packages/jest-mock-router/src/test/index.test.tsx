import * as React from 'react';
import {mount} from 'enzyme';
import {withRouter, WithRouterProps} from 'react-router';

import {createRouter, createLocation} from '..';

function TestPage({location}: WithRouterProps) {
  return <p>{location.pathname}</p>;
}

const SomePage = withRouter(TestPage) as React.ComponentType;

describe('jest-mock-router', () => {
  describe('createRouter', () => {
    it('works', () => {
      mount(<SomePage />, {
        context: {
          router: createRouter(),
        },
      });
    });
  });

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
});
