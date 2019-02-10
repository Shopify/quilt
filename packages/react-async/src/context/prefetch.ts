import * as React from 'react';
import {IfAllOptionalKeys} from '@shopify/useful-types';
import {Prefetchable} from '../shared';

type PropMapper<Props> = (url: string) => Props;

type RegisterOptions<Props> = {
  url: string | RegExp;
} & IfAllOptionalKeys<
  Props,
  {mapUrlToProps?: PropMapper<Props>},
  {mapUrlToProps: PropMapper<Props>}
>;

export type Record<Props> = RegisterOptions<Props> & {
  component: Prefetchable<Props>;
};

export class PrefetchManager {
  registered: Set<Record<any>>;

  constructor(registered?: Record<any>[]) {
    this.registered = new Set(registered);
  }

  register<Props>(
    component: Prefetchable<Props>,
    options: RegisterOptions<Props>,
  ) {
    const record = {component, ...(options as any)};
    this.registered.add(record);
    return () => this.registered.delete(record);
  }
}

export const PrefetchContext = React.createContext<PrefetchManager | undefined>(
  undefined,
);
