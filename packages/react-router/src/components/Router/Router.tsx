import React from 'react';
import {StaticRouter, BrowserRouter} from 'react-router-dom';
import {isServer} from './utilities';

interface Props {
  location?: string;
  children?: React.ReactNode;
}

export default function Router({location, children}: Props) {
  return isServer() && location ? (
    <StaticRouter location={location} context={{}}>
      {children}
    </StaticRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );
}
