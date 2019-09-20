import React from 'react';
import {createServer, DefaultProvider} from '@shopify/react-server';
import App from 'index';

const render = ctx =>
  React.createElement(
    DefaultProvider,
    null,
    React.createElement(App, {
      server: true,
      location: ctx.request.url,
    }),
  );

const app = createServer({
  render,
});

export default app;
