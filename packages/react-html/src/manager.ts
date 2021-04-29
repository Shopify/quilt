import {EffectKind} from '@shopify/react-effect';

import {getSerializationsFromDocument} from './utilities';

interface Title {
  title: string;
}

export interface State {
  title?: string;
  metas: Array<React.HTMLProps<HTMLMetaElement>>;
  links: Array<React.HTMLProps<HTMLLinkElement>>;
  inlineStyles: Array<React.HTMLProps<HTMLStyleElement>>;
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
  private metas: Array<React.HTMLProps<HTMLMetaElement>> = [];
  private links: Array<React.HTMLProps<HTMLLinkElement>> = [];
  private inlineStyles: Array<React.HTMLProps<HTMLStyleElement>> = [];
  private htmlAttributes: Array<React.HtmlHTMLAttributes<HTMLHtmlElement>> = [];
  private bodyAttributes: Array<React.HTMLProps<HTMLBodyElement>> = [];
  private subscriptions = new Set<Subscription>();

  get state(): State {
    const lastTitle = this.titles[this.titles.length - 1];

    return {
      title: lastTitle && lastTitle.title,
      metas: this.metas,
      links: this.links,
      inlineStyles: this.inlineStyles,
      bodyAttributes: Object.assign({}, ...this.bodyAttributes),
      htmlAttributes: Object.assign({}, ...this.htmlAttributes),
    };
  }

  reset({includeSerializations = false} = {}) {
    this.titles = [];
    this.metas = [];
    this.links = [];
    this.inlineStyles = [];

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
    return this.addDescriptor({title}, this.titles);
  }

  addMeta(meta: React.HTMLProps<HTMLMetaElement>) {
    return this.addDescriptor(meta, this.metas);
  }

  addLink(link: React.HTMLProps<HTMLLinkElement>) {
    return this.addDescriptor(link, this.links);
  }

  addInlineStyle(inlineStyle: React.HTMLProps<HTMLStyleElement>) {
    return this.addDescriptor(inlineStyle, this.inlineStyles);
  }

  addHtmlAttributes(attributes: React.HtmlHTMLAttributes<HTMLHtmlElement>) {
    return this.addDescriptor(attributes, this.htmlAttributes);
  }

  addBodyAttributes(attributes: React.HTMLProps<HTMLBodyElement>) {
    return this.addDescriptor(attributes, this.bodyAttributes);
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

  private addDescriptor<T>(item: T, list: T[]) {
    list.push(item);
    this.updateSubscriptions();

    return () => {
      const index = list.indexOf(item);
      if (index >= 0) {
        list.splice(index, 1);
        this.updateSubscriptions();
      }
    };
  }

  private updateSubscriptions() {
    for (const subscription of this.subscriptions) {
      subscription(this.state);
    }
  }
}
