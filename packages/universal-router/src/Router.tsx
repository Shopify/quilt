import * as React from 'react';
import {StaticRouter, BrowserRouter} from 'react-router-dom';

interface Props {
  location?: string;
  children?: React.ReactNode;
}

export default function Router({location, children}: Props) {
  const isServer = typeof window === 'undefined';

  return isServer && location ? (
    <StaticRouter location={location} context={{}}>
      {children}
    </StaticRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );
}
