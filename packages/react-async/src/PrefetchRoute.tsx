import * as React from 'react';
import {Omit, IfAllOptionalKeys} from '@shopify/useful-types';

import {Prefetchable} from './shared';
import {PrefetchContext, PrefetchManager} from './context/prefetch';

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
  manager: PrefetchManager;
  url: string | RegExp;
  component: Prefetchable<PrefetchProps>;
}

class ConnectedPrefetchRoute<PrefetchProps> extends React.Component<
  Props<PrefetchProps> & UrlMapperProps<PrefetchProps>
> {
  private unregister?: ReturnType<PrefetchManager['register']>;

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

export function PrefetchRoute<PrefetchProps>(
  props: Omit<Props<PrefetchProps>, 'manager'> & UrlMapperProps<PrefetchProps>,
) {
  return (
    <PrefetchContext.Consumer>
      {manager =>
        manager ? (
          <ConnectedPrefetchRoute manager={manager} {...props as any} />
        ) : null
      }
    </PrefetchContext.Consumer>
  );
}
