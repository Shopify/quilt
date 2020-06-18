import React from 'react';
import {Switch, Route} from '@shopify/react-router';
import {Home} from 'features';
import {NotFound} from 'components/NotFound';

export function Routes() {
  return (
    <Switch>
      <Route path="/" exact render={() => <Home />} />
      <Route render={() => <NotFound />} />
    </Switch>
  );
}
