import {EffectKind} from '@shopify/react-effect';
import {getSerializationsFromDocument} from './utilities';

interface Title {
  title: string;
}

export interface State {
  title?: string;
  metas: React.HTMLProps<HTMLMetaElement>[];
  links: React.HTMLProps<HTMLLinkElement>[];
}

interface Subscription {
  (state: State): void;
}

export const EFFECT_ID = Symbol('html');

export default class Manager {
  effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => this.reset(),
  };

  private isServer: boolean;
  private serializations = getSerializationsFromDocument();
  private titles: Title[] = [];
  private metas: React.HTMLProps<HTMLMetaElement>[] = [];
  private links: React.HTMLProps<HTMLLinkElement>[] = [];
  private subscriptions = new Set<Subscription>();

  get state(): State {
    const lastTitle = this.titles[this.titles.length - 1];

    return {
      title: lastTitle && lastTitle.title,
      metas: this.metas,
      links: this.links,
    };
  }

  constructor({isServer = typeof document === 'undefined'} = {}) {
    this.isServer = isServer;
  }

  reset({includeSerializations = false} = {}) {
    this.titles = [];
    this.metas = [];
    this.links = [];
    this.subscriptions.clear();

    if (includeSerializations) {
      this.serializations.clear();
    }
  }

  subscribe(subscription: Subscription) {
    this.subscriptions.add(subscription);
  }

  addTitle(title: string) {
    const titleObject = {title};
    this.titles.push(titleObject);
    this.updateSubscriptions();
    return this.removeTitle.bind(this, titleObject);
  }

  addMeta(meta: React.HTMLProps<HTMLMetaElement>) {
    this.metas.push(meta);
    this.updateSubscriptions();
    return this.removeMeta.bind(this, meta);
  }

  addLink(link: React.HTMLProps<HTMLLinkElement>) {
    this.links.push(link);
    this.updateSubscriptions();
    return this.removeLink.bind(this, link);
  }

  setSerialization(id: string, data: unknown) {
    if (this.isServer) {
      this.serializations.set(id, data);
    }
  }

  getSerialization<T>(id: string): T | undefined {
    return this.serializations.get(id) as T | undefined;
  }

  extract() {
    return {
      ...this.state,
      serializations: [...this.serializations.entries()].map(([id, data]) => ({
        id,
        data,
      })),
    };
  }

  private updateSubscriptions() {
    for (const subscription of this.subscriptions) {
      subscription(this.state);
    }
  }

  private removeTitle(title: Title) {
    const index = this.titles.indexOf(title);
    if (index >= 0) {
      this.titles.splice(index, 1);
      this.updateSubscriptions();
    }
  }

  private removeMeta(meta: React.HTMLProps<HTMLMetaElement>) {
    const index = this.metas.indexOf(meta);
    if (index >= 0) {
      this.metas.splice(index, 1);
      this.updateSubscriptions();
    }
  }

  private removeLink(link: React.HTMLProps<HTMLLinkElement>) {
    const index = this.links.indexOf(link);
    if (index >= 0) {
      this.links.splice(index, 1);
      this.updateSubscriptions();
    }
  }
}
