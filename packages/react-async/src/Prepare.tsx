import * as React from 'react';
import {Omit, IfAllOptionalKeys} from '@shopify/useful-types';

import {Prefetchable} from './shared';
import {Manager} from './manager';
import {AsyncContext} from './context';

interface UrlMapperPropsNonOptional<Props> {
  mapUrlToProps(path: string): Props;
}

interface UrlMapperPropsOptional<Props> {
  mapUrlToProps?(path: string): Props | void;
}

type UrlMapperProps<Props> = IfAllOptionalKeys<
  Props,
  UrlMapperPropsOptional<Props>,
  UrlMapperPropsNonOptional<Props>
>;

interface Props<PrefetchProps> {
  manager: Manager;
  url: string | RegExp;
  component: Prefetchable<PrefetchProps>;
}

class ConnectedPrepare<PrefetchProps> extends React.Component<
  Props<PrefetchProps> & UrlMapperProps<PrefetchProps>
> {
  private unregister?: ReturnType<Manager['register']>;

  componentDidMount() {
    const {manager, component, url, mapUrlToProps} = this.props;
    this.unregister = manager.register(component, {
      url,
      mapUrlToProps,
    } as any);
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
  }

  render() {
    return null;
  }
}

export function Prepare<PrefetchProps>(
  props: Omit<Props<PrefetchProps>, 'manager'> & UrlMapperProps<PrefetchProps>,
) {
  return (
    <AsyncContext.Consumer>
      {manager => <ConnectedPrepare manager={manager} {...props as any} />}
    </AsyncContext.Consumer>
  );
}
