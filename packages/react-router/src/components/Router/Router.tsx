import React from 'react';
import {StaticRouter, BrowserRouter} from 'react-router-dom';

import {isClient} from './utilities';

interface Props {
  location?: string;
  basename?: string;
  children?: React.ReactNode;
}

export const NO_LOCATION_ERROR =
  'A location must be passed to <Router /> on the server.';

export default function Router({location, basename, children}: Props) {
  if (isClient()) {
    return <BrowserRouter basename={basename}>{children}</BrowserRouter>;
  }

  if (location == null) {
    throw new Error(NO_LOCATION_ERROR);
  }

  return (
    <StaticRouter basename={basename} location={location} context={{}}>
      {children}
    </StaticRouter>
  );
}
