import React, {useState} from 'react';
import {mount} from '@shopify/react-testing';
import {matchMedia} from '@shopify/jest-dom-mocks';

import {useMedia} from '../media';

describe('useMedia', () => {
  beforeEach(() => {
    matchMedia.mock();
  });

  afterEach(() => {
    matchMedia.restore();
  });

  function Message() {
    const message = useMedia(
      ['(max-width: 748px)'],
      ['You are using a small screen'],
      'Default message',
    );

    return <p>{message}</p>;
  }

  it('shows labels when media does not match', () => {
    matchMedia.setMedia(() => ({matches: false}));
    const message = mount(<Message />);

    expect(message).toContainReactComponent('p', {
      children: 'Default message',
    });
  });

  it('hides labels when media matches', () => {
    matchMedia.setMedia(() => ({matches: true}));
    const message = mount(<Message />);

    expect(message).toContainReactComponent('p', {
      children: 'You are using a small screen',
    });
  });
});
