import React from 'react';
import {StaticRouter, BrowserRouter} from 'react-router-dom';

import {isClient} from './utilities';

interface Props {
  location?: string | URL;
  children?: React.ReactNode;
}

export const NO_LOCATION_ERROR =
  'A location must be passed to <Router /> on the server.';

export default function Router({location, children}: Props) {
  if (isClient()) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  if (location == null) {
    throw new Error(NO_LOCATION_ERROR);
  }

  return (
    <StaticRouter location={location} context={{}}>
      {children}
    </StaticRouter>
  );
}
