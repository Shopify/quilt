import React from 'react';
import {StaticRouter, BrowserRouter} from 'react-router-dom';

import {isClient} from './utilities';

interface Props {
  children?: React.ReactNode;
  location?: string | {pathname: string; search: string};
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

  // Internally react-router uses the spread (...) operator to clone the object we pass in.
  // This means that we lose any properties which come from the prototype even if they are the ones we need.
  // As a result we need to manually pull the properties off to build our object if we want this API to work with stuff like URLs or other instances.
  const locationObject =
    typeof location === 'object'
      ? {
          pathname: location.pathname,
          search: location.search,
          hash: '',
          state: undefined,
        }
      : location;

  return (
    <StaticRouter location={locationObject} context={{}}>
      {children}
    </StaticRouter>
  );
}
