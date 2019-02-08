import {IfAllOptionalKeys} from '@shopify/useful-types';
import {Prefetchable} from './shared';

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

export interface Manager {
  registered: Set<Record<any>>;
  register<Props>(
    component: Prefetchable<Props>,
    options: RegisterOptions<Props>,
  ): () => void;
  markAsUsed(id: string): void;
}

export const noopManager: Manager = {
  registered: new Set(),
  register() {
    return () => {};
  },
  markAsUsed() {},
};

export class AsyncManager implements Manager {
  registered = new Set<Record<any>>();
  used = new Set<string>();

  register<Props>(
    component: Prefetchable<Props>,
    options: RegisterOptions<Props>,
  ) {
    const record = {component, ...(options as any)};
    this.registered.add(record);
    return () => this.registered.delete(record);
  }

  markAsUsed(id: string) {
    this.used.add(id);
  }
}
