import React, {useEffect} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Redirect as NetworkRedirect} from '@shopify/react-network';

interface Props {
  url: string;
}

type ComposedProps = Props & RouteComponentProps;

function Redirect({url, history}: ComposedProps) {
  useEffect(() => {
    history.push(url);
  }, [history, url]);
  return <NetworkRedirect url={url} />;
}

export default withRouter(Redirect);
