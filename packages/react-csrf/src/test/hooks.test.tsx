import React from 'react';
import faker from 'faker';

import {mount} from '@shopify/react-testing';

import {CsrfTokenContext} from '../context';
import {useCsrfToken} from '../hooks';

describe('<CsrfProvider />', () => {
  function CsrfToken() {
    const csrfToken = useCsrfToken();
    return <div id="csrfToken">{csrfToken}</div>;
  }

  it('renders a csrfToken with value from the context', () => {
    const token = faker.lorem.word();
    const csrf = mount(
      <CsrfTokenContext.Provider value={token}>
        <CsrfToken />
      </CsrfTokenContext.Provider>,
    );

    expect(csrf).toContainReactText(token);
  });

  it('throws an error if there is no token in the context', () => {
    expect(() => mount(<CsrfToken />)).toThrow(
      'No CSRF token found in context.',
    );
  });
});
