import React from 'react';
import {StaticRouter, BrowserRouter} from 'react-router-dom';

import {isClient} from './utilities';

interface Props {
  children?: React.ReactNode;
  location?: string | {pathname: string; search: string};
  basename?: string;
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

  // Internally react-router uses the spread (...) operator to clone the object we pass in.
  // This means that we lose any properties that is not enumerable even (ie. pathname on a URL object is not enumerable)
  // As a result we need to manually access the properties to build location object
  // if we want this API to work with obejct like URLs or other instances.
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
    <StaticRouter basename={basename} location={locationObject} context={{}}>
      {children}
    </StaticRouter>
  );
}
