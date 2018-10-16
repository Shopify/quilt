import * as React from 'react';
import {Switch, Route} from 'react-router';
import {Main} from 'sections';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
    </Switch>
  );
}
