import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {mount} from '@shopify/react-testing';
import Router from '../Router';

describe('Router', () => {
  it('renders children', async () => {
    const text = 'Hello router';
    const wrapper = await mount(<Router>{text}</Router>);

    expect(wrapper).toContainReactText(text);
  });

  it('mounts a BrowserRouter by default', async () => {
    const wrapper = await mount(<Router />);

    expect(wrapper).toContainReactComponent(BrowserRouter);
  });
});
