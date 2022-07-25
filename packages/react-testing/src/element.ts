import React from 'react';

import {nodeName, toReactString} from './toReactString';
import {
  Tag,
  Node,
  Predicate,
  FunctionKeys,
  DeepPartialArguments,
  PropsFor,
  UnknowablePropsFor,
  DebugOptions,
  TriggerKeypathParams,
  TriggerKeypathReturn,
  KeyPathFunction,
  ExtractKeypath,
} from './types';

type Root = import('./root').Root<unknown>;

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

  private get elementDescendants() {
    if (!this.descendantsCache) {
      this.descendantsCache = getDescendants(this);
    }

    return this.descendantsCache;
  }

  private get elementChildren() {
    if (!this.elementChildrenCache) {
      this.elementChildrenCache = this.allChildren.filter(
        (element) => typeof element !== 'string',
      ) as Element<unknown>[];
    }

    return this.elementChildrenCache;
  }

  get descendants() {
    return this.elementDescendants;
  }

  get domNodes(): HTMLElement[] {
    if (this.isDOM) {
      return [this.instance];
    }

    return this.elementChildren
      .filter((element) => element.isDOM)
      .map((element) => element.instance);
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

  private descendantsCache: Element<unknown>[] | null = null;
  private elementChildrenCache: Element<unknown>[] | null = null;

  constructor(
    private readonly tree: Tree<Props>,
    private readonly allChildren: (Element<unknown> | string)[],
    public readonly root: Root,
  ) {}

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
      (element) =>
        isMatchingType(element.type, type) &&
        (props == null || equalSubset(props, element.props as object)),
    ) || null) as Element<PropsFor<Type>> | null;
  }

  findAll<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ): Element<PropsFor<Type>>[] {
    return this.elementDescendants.filter(
      (element) =>
        isMatchingType(element.type, type) &&
        (props == null || equalSubset(props, element.props as object)),
    ) as Element<PropsFor<Type>>[];
  }

  findWhere<Type extends React.ComponentType<any> | string | unknown = unknown>(
    predicate: Predicate,
  ): Element<UnknowablePropsFor<Type>> | null {
    return (this.elementDescendants.find((element) => predicate(element)) ||
      null) as Element<UnknowablePropsFor<Type>> | null;
  }

  findAllWhere<
    Type extends React.ComponentType<any> | string | unknown = unknown,
  >(predicate: Predicate): Element<UnknowablePropsFor<Type>>[] {
    return this.elementDescendants.filter((element) =>
      predicate(element),
    ) as Element<UnknowablePropsFor<Type>>[];
  }

  trigger<K extends FunctionKeys<Props>>(
    prop: K,
    ...args: DeepPartialArguments<Props[K]>
  ): NonNullable<Props[K]> extends (...args: any[]) => any
    ? ReturnType<NonNullable<Props[K]>>
    : never {
    return this.root.act(() => {
      const propValue = this.props[prop];

      if (propValue == null) {
        throw new Error(
          `Attempted to call prop ${String(prop)} but it was not defined.`,
        );
      }

      return (propValue as any)(...args);
    });
  }

  triggerKeypath<
    Path extends string,
    ExtractedFunction extends KeyPathFunction = ExtractKeypath<Props, Path>,
  >(
    ...params: TriggerKeypathParams<Props, Path, ExtractedFunction>
  ): TriggerKeypathReturn<Props, Path, ExtractedFunction> {
    return this.root.act(() => {
      const [keypath, ...args] = params;
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
    (key) => key in full && full[key] === subset[key],
  );
}

function getDescendants(element: any) {
  const descendants: Element<unknown>[] = [];
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < element.allChildren.length; i++) {
    const child = element.allChildren[i];
    if (typeof child !== 'string') {
      descendants.push(child);
      // eslint-disable-next-line prefer-spread
      descendants.push.apply(descendants, child.elementDescendants);
    }
  }

  return descendants;
}
