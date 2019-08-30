import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import {Redirect as NetworkRedirect} from '@shopify/react-network';

interface Props {
  url: string;
}

type ComposedProps = Props & RouteComponentProps<{}, {}>;

class Redirect extends React.Component<ComposedProps> {
  componentDidMount() {
    this.props.router.push(this.props.url);
  }

  render() {
    return <NetworkRedirect url={this.props.url} />;
  }
}

export default withRouter(Redirect);
