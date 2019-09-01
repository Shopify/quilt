import React, {useEffect} from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import {Redirect as NetworkRedirect} from '@shopify/react-network';

interface Props {
  url: string;
}

type ComposedProps = Props & RouteComponentProps<{}, {}>;

function Redirect(props: ComposedProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => props.router.push(props.url), []);
  return <NetworkRedirect url={props.url} />;
}

export default withRouter(Redirect);
