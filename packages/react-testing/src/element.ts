import React from 'react';
import {
  Arguments,
  MaybeFunctionReturnType as ReturnType,
} from '@shopify/useful-types';

import {nodeName, toReactString} from './toReactString';
import {
  Tag,
  Node,
  Predicate,
  FunctionKeys,
  DeepPartialArguments,
  PropsFor,
  DebugOptions,
} from './types';

type Root = import('./root').Root<any>;

interface Tree<Props> {
  tag: Tag;
  type: string | React.ComponentType<any> | null;
  props: Props;
  instance?: any;
}

export class Element<Props> implements Node<Props> {
  get props(): Props {
    return this.tree.props;
  }

  get type() {
    return this.tree.type;
  }

  get isDOM() {
    return this.tree.tag === Tag.HostComponent;
  }

  get instance() {
    return this.tree.instance;
  }

  get children() {
    return this.elementChildren;
  }

  get descendants() {
    return this.elementDescendants;
  }

  get domNodes(): HTMLElement[] {
    if (this.isDOM) {
      return [this.instance];
    }

    return this.elementChildren
      .filter(element => element.isDOM)
      .map(element => element.instance);
  }

  get domNode(): HTMLElement | null {
    const {domNodes} = this;

    if (domNodes.length > 1) {
      throw new Error(
        'You can’t call getDOMNode() on an element that returns multiple HTML elements. Call getDOMNodes() to retrieve all of the elements instead.',
      );
    }

    return domNodes[0] || null;
  }

  private readonly elementChildren: Element<unknown>[];
  private readonly elementDescendants: Element<unknown>[];

  constructor(
    private readonly tree: Tree<Props>,
    private readonly allChildren: (Element<unknown> | string)[],
    allDescendants: (Element<unknown> | string)[],
    public readonly root: Root,
  ) {
    this.elementChildren = allChildren.filter(
      element => typeof element !== 'string',
    ) as Element<unknown>[];

    this.elementDescendants = allDescendants.filter(
      element => typeof element !== 'string',
    ) as Element<unknown>[];
  }

  data(key: string): string | undefined {
    return this.props[key.startsWith('data-') ? key : `data-${key}`];
  }

  prop<K extends keyof Props>(key: K): Props[K] {
    return this.props[key];
  }

  text(): string {
    const {
      instance,
      allChildren,
      tree: {tag},
    } = this;

    if (tag === Tag.HostPortal) {
      return '';
    }

    if (instance instanceof HTMLElement) {
      return instance.textContent || '';
    }

    return allChildren.reduce<string>(
      (text, child) =>
        text + (typeof child === 'string' ? child : child.text()),
      '',
    );
  }

  html(): string {
    const {
      instance,
      allChildren,
      tree: {tag},
    } = this;

    if (tag === Tag.HostPortal) {
      return '';
    }

    if (instance instanceof HTMLElement) {
      return instance.outerHTML;
    }

    return allChildren.reduce<string>(
      (text, child) =>
        text + (typeof child === 'string' ? child : child.html()),
      '',
    );
  }

  is<Type extends React.ComponentType<any> | string>(
    type: Type,
  ): this is Element<PropsFor<Type>> {
    return isMatchingType(this.type, type);
  }

  find<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ): Element<PropsFor<Type>> | null {
    return (this.elementDescendants.find(
      element =>
        isMatchingType(element.type, type) &&
        (props == null || equalSubset(props, element.props as object)),
    ) || null) as Element<PropsFor<Type>> | null;
  }

  findAll<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ): Element<PropsFor<Type>>[] {
    return this.elementDescendants.filter(
      element =>
        isMatchingType(element.type, type) &&
        (props == null || equalSubset(props, element.props as object)),
    ) as Element<PropsFor<Type>>[];
  }

  findWhere(predicate: Predicate): Element<unknown> | null {
    return this.elementDescendants.find(element => predicate(element)) || null;
  }

  findAllWhere(predicate: Predicate): Element<unknown>[] {
    return this.elementDescendants.filter(element => predicate(element));
  }

  trigger<K extends FunctionKeys<Props>>(
    prop: K,
    ...args: DeepPartialArguments<Arguments<Props[K]>>
  ): ReturnType<NonNullable<Props[K]>> {
    return this.root.internalAct(() => {
      const propValue = this.props[prop];

      if (propValue == null) {
        throw new Error(
          `Attempted to call prop ${prop} but it was not defined.`,
        );
      }

      return (propValue as any)(...args);
    });
  }

  triggerKeypath<T = unknown>(keypath: string, ...args: unknown[]): T {
    return this.root.internalAct(() => {
      const {props} = this;
      const parts = keypath.split(/[.[\]]/g).filter(Boolean);

      let currentProp: any = props;
      const currentKeypath: string[] = [];

      for (const part of parts) {
        if (currentProp == null || typeof currentProp !== 'object') {
          throw new Error(
            `Attempted to access field keypath '${currentKeypath.join(
              '.',
            )}', but it was not an object.`,
          );
        }

        currentProp = currentProp[part];
        currentKeypath.push(part);
      }

      if (typeof currentProp !== 'function') {
        throw new Error(`Value at keypath '${keypath}' is not a function.`);
      }

      return currentProp(...args);
    });
  }

  debug(options?: DebugOptions) {
    return toReactString(this, options);
  }

  toString() {
    return `<${nodeName(this)} />`;
  }
}

function isMatchingType(
  type: Tree<unknown>['type'],
  test: Tree<unknown>['type'],
) {
  if (type === test) {
    return true;
  }

  if (test == null) {
    return false;
  }

  return (test as any).type != null && isMatchingType(type, (test as any).type);
}

function equalSubset(subset: object, full: object) {
  return Object.keys(subset).every(
    key => key in full && full[key] === subset[key],
  );
}
