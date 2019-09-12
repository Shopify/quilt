import React from 'react';
import {createServer} from '@shopify/react-server';
import App from 'index';

const render = ctx =>
  React.createElement(App, {
    server: true,
    location: ctx.request.url,
  });

const app = createServer({
  render,
});

export default app;
