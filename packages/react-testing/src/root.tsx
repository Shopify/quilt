import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {
  Arguments,
  Props as PropsForComponent,
  MaybeFunctionReturnType as ReturnType,
} from '@shopify/useful-types';

import {TestWrapper} from './TestWrapper';
import {Element, Predicate} from './element';
import {
  Tag,
  Fiber,
  ReactInstance,
  FunctionKeys,
  DeepPartialArguments,
} from './types';
import {withIgnoredReactLogs} from './errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {findCurrentFiberUsingSlowPath} = require('react-reconciler/reflection');

type ResolveRoot = (element: Element<unknown>) => Element<unknown> | null;

export const connected = new Set<Root<unknown>>();

export class Root<Props> {
  get props() {
    return this.withRoot(root => root.props);
  }

  get isDOM() {
    return this.withRoot(root => root.isDOM);
  }

  get type() {
    return this.withRoot(root => root.type);
  }

  get instance() {
    return this.withRoot(root => root.instance);
  }

  get children() {
    return this.withRoot(root => root.children);
  }

  get descendants() {
    return this.withRoot(root => root.descendants);
  }

  get domNodes() {
    return this.withRoot(root => root.domNodes);
  }

  get domNode() {
    return this.withRoot(root => root.domNode);
  }

  private wrapper: TestWrapper<Props> | null = null;
  private element = document.createElement('div');
  private root: Element<Props> | null = null;
  private acting = false;

  private get mounted() {
    return this.wrapper != null;
  }

  constructor(
    private tree: React.ReactElement<Props>,
    private resolveRoot: ResolveRoot = defaultResolveRoot,
  ) {
    this.mount();
  }

  act<T>(action: () => T, {update = true} = {}): T {
    let result!: T;

    if (this.acting) {
      return action();
    }

    this.acting = true;

    withIgnoredReactLogs(() =>
      act(() => {
        result = action();
      }),
    );

    if (update) {
      this.update();
    }

    this.acting = false;

    return result;
  }

  html() {
    return this.withRoot(root => root.html());
  }

  text() {
    return this.withRoot(root => root.text());
  }

  is<Type extends React.ComponentType<any> | string>(
    type: Type,
  ): this is Root<PropsForComponent<Type>> {
    return this.withRoot(root => root.is(type));
  }

  prop<K extends keyof Props>(key: K) {
    return this.withRoot(root => root.prop(key));
  }

  find<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsForComponent<Type>>,
  ) {
    return this.withRoot(root => root.find(type, props));
  }

  findAll<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsForComponent<Type>>,
  ) {
    return this.withRoot(root => root.findAll(type, props));
  }

  findWhere(predicate: Predicate) {
    return this.withRoot(root => root.findWhere(predicate));
  }

  findAllWhere(predicate: Predicate) {
    return this.withRoot(root => root.findAllWhere(predicate));
  }

  trigger<K extends FunctionKeys<Props>>(
    prop: K,
    ...args: DeepPartialArguments<Arguments<Props[K]>>
  ): ReturnType<NonNullable<Props[K]>> {
    return this.withRoot(root => root.trigger(prop, ...(args as any)));
  }

  triggerKeypath<T = unknown>(keypath: string, ...args: unknown[]) {
    return this.withRoot(root => root.triggerKeypath<T>(keypath, ...args));
  }

  mount() {
    if (this.mounted) {
      throw new Error('Attempted to mount a node that was already mounted');
    }

    if (this.element.parentNode == null) {
      document.body.appendChild(this.element);
      connected.add(this);
    }

    this.act(() => {
      render(
        <TestWrapper<Props>
          ref={wrapper => {
            this.wrapper = wrapper;
          }}
        >
          {this.tree}
        </TestWrapper>,
        this.element,
      );
    });
  }

  unmount() {
    if (!this.mounted) {
      throw new Error(
        'You attempted to unmount a node that was already unmounted',
      );
    }

    this.ensureRoot();
    this.act(() => unmountComponentAtNode(this.element));
  }

  destroy() {
    const {element, mounted} = this;

    if (mounted) {
      this.unmount();
    }

    element.remove();
    connected.delete(this);
  }

  setProps(props: Partial<Props>) {
    this.ensureRoot();
    this.act(() => this.wrapper!.setProps(props));
  }

  forceUpdate() {
    this.ensureRoot();
    this.act(() => this.wrapper!.forceUpdate());
  }

  toString() {
    return this.withRoot(root => root.toString());
  }

  private update() {
    if (this.wrapper == null) {
      this.root = null;
    } else {
      const topElement = flatten(
        ((this.wrapper as unknown) as ReactInstance)._reactInternalFiber,
        this,
      )[0];

      this.root = this.resolveRoot(topElement as any) as any;
    }
  }

  private ensureRoot() {
    if (this.wrapper == null || this.root == null) {
      throw new Error(
        'Attempted to operate on a mounted tree, but the component is no longer mounted',
      );
    }
  }

  private withRoot<T>(withRoot: (root: Element<Props>) => T): T {
    this.ensureRoot();
    return withRoot(this.root!);
  }
}

function defaultResolveRoot(element: Element<unknown>) {
  return element.children[0];
}

function flatten(
  element: Fiber,
  root: Root<unknown>,
): (Element<unknown> | string)[] {
  const node: Fiber = findCurrentFiberUsingSlowPath(element);

  if (node.tag === Tag.HostText) {
    return [node.memoizedProps as string];
  }

  const props = {...(node.memoizedProps || {})};
  const {children, descendants} = childrenToTree(node.child, root);

  return [
    new Element(
      {
        tag: node.tag,
        type: node.type,
        props,
        instance: node.stateNode,
      },
      children,
      descendants,
      root,
    ),
    ...descendants,
  ];
}

function childrenToTree(fiber: Fiber | null, root: Root<unknown>) {
  let currentFiber = fiber;
  const children: (string | Element<unknown>)[] = [];
  const descendants: (string | Element<unknown>)[] = [];

  while (currentFiber != null) {
    const result = flatten(currentFiber, root);

    if (result.length > 0) {
      children.push(result[0]);
      descendants.push(...result);
    }

    currentFiber = currentFiber.sibling;
  }

  return {children, descendants};
}
