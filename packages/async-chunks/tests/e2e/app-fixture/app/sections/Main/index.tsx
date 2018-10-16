import * as React from 'react';
import {Switch, Route, withRouter, RouteComponentProps} from 'react-router';
import compose from '@shopify/react-compose';

import MainIndex from './MainIndex';

interface Props {}
type ComposedProps = RouteComponentProps<{}> & Props;

function MainRoutes({match}: ComposedProps) {
  return (
    <Switch>
      <Route exact path={match.url} component={MainIndex} />
    </Switch>
  );
}

export default compose<Props>(withRouter)(MainRoutes);
