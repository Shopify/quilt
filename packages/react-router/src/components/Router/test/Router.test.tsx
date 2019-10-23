import React from 'react';
import {BrowserRouter, StaticRouter} from 'react-router-dom';
import {mount} from '@shopify/react-testing';
import Router from '../Router';

jest.mock('../utilities', () => ({
  isServer: jest.fn(),
}));

const {isServer} = require.requireMock('../utilities') as {
  isServer: jest.Mock;
};

describe('Router', () => {
  beforeEach(() => {
    isServer.mockClear();
    isServer.mockImplementation(() => false);
  });

  it('renders children', async () => {
    const text = 'Hello router';
    const wrapper = await mount(<Router>{text}</Router>);

    expect(wrapper).toContainReactText(text);
  });

  it('mounts a BrowserRouter by default', async () => {
    const wrapper = await mount(<Router />);

    expect(wrapper).toContainReactComponent(BrowserRouter);
  });

  it('mounts a StaticRouter on the server with the delegated location prop', async () => {
    isServer.mockReturnValue(true);

    const location = 'http://www.shopify.com';
    const wrapper = await mount(<Router location={location} />);

    expect(wrapper).toContainReactComponent(StaticRouter, {location});
  });
});
