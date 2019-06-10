import {EffectKind} from '@shopify/react-effect';
import {getSerializationsFromDocument} from './utilities';

interface Title {
  title: string;
}

export interface State {
  title?: string;
  metas: React.HTMLProps<HTMLMetaElement>[];
  links: React.HTMLProps<HTMLLinkElement>[];
  bodyAttributes: React.HTMLProps<HTMLBodyElement>;
  htmlAttributes: React.HtmlHTMLAttributes<HTMLHtmlElement>;
}

interface Subscription {
  (state: State): void;
}

export const EFFECT_ID = Symbol('html');

export class HtmlManager {
  effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => this.reset(),
  };

  private serializations = getSerializationsFromDocument();
  private titles: Title[] = [];
  private metas: React.HTMLProps<HTMLMetaElement>[] = [];
  private links: React.HTMLProps<HTMLLinkElement>[] = [];
  private htmlAttributes: React.HtmlHTMLAttributes<HTMLHtmlElement>[] = [];
  private bodyAttributes: React.HTMLProps<HTMLBodyElement>[] = [];
  private subscriptions = new Set<Subscription>();

  get state(): State {
    const lastTitle = this.titles[this.titles.length - 1];

    return {
      title: lastTitle && lastTitle.title,
      metas: this.metas,
      links: this.links,
      bodyAttributes: Object.assign({}, ...this.bodyAttributes),
      htmlAttributes: Object.assign({}, ...this.htmlAttributes),
    };
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
    return () => {
      this.subscriptions.delete(subscription);
    };
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

  addHtmlAttributes(attributes: React.HtmlHTMLAttributes<HTMLHtmlElement>) {
    this.htmlAttributes.push(attributes);
    this.updateSubscriptions();
    return this.removeHtmlAttributes.bind(this, attributes);
  }

  addBodyAttributes(attributes: React.HTMLProps<HTMLBodyElement>) {
    this.bodyAttributes.push(attributes);
    this.updateSubscriptions();
    return this.removeBodyAttributes.bind(this, attributes);
  }

  setSerialization(id: string, data: unknown) {
    this.serializations.set(id, data);
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

  private removeHtmlAttributes(
    attributes: React.HtmlHTMLAttributes<HTMLHtmlElement>,
  ) {
    const index = this.htmlAttributes.indexOf(attributes);

    if (index >= 0) {
      this.htmlAttributes.splice(index, 1);
      this.updateSubscriptions();
    }
  }

  private removeBodyAttributes(attributes: React.HTMLProps<HTMLBodyElement>) {
    const index = this.bodyAttributes.indexOf(attributes);

    if (index >= 0) {
      this.bodyAttributes.splice(index, 1);
      this.updateSubscriptions();
    }
  }
}
