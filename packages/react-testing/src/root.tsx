import React from 'react';
import {flushSync} from 'react-dom';
import type {Root as ReactRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';

import {TestWrapper} from './TestWrapper';
import {Element} from './element';
import {createRoot, getInternals} from './compat';
import {
  Tag,
  Fiber,
  Node,
  Predicate,
  FunctionKeys,
  DeepPartialArguments,
  PropsFor,
  DebugOptions,
  TriggerKeypathParams,
  TriggerKeypathReturn,
  KeyPathFunction,
  ExtractKeypath,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {findCurrentFiberUsingSlowPath} = require('react-reconciler/reflection');

type ResolveRoot = (element: Element<unknown>) => Element<unknown> | null;
type Render = (
  element: React.ReactElement<unknown>,
) => React.ReactElement<unknown>;

export interface Options {
  render?: Render;
  resolveRoot?: ResolveRoot;
}

export const connected = new Set<Root<unknown>>();

export class Root<Props> implements Node<Props> {
  get props() {
    return this.withRoot((root) => root.props);
  }

  get isDOM() {
    return this.withRoot((root) => root.isDOM);
  }

  get type() {
    return this.withRoot((root) => root.type);
  }

  get instance() {
    return this.withRoot((root) => root.instance);
  }

  get children() {
    return this.withRoot((root) => root.children);
  }

  get descendants() {
    return this.withRoot((root) => root.descendants);
  }

  get domNodes() {
    return this.withRoot((root) => root.domNodes);
  }

  get domNode() {
    return this.withRoot((root) => root.domNode);
  }

  private wrapper: TestWrapper<Props> | null = null;
  private element = document.createElement('div');
  private reactRoot: ReactRoot | null = null;
  private root: Element<Props> | null = null;
  private acting = false;

  private render: Render;
  private resolveRoot: ResolveRoot;

  private get mounted() {
    return this.wrapper != null;
  }

  constructor(
    private tree: React.ReactElement<Props>,
    {render = defaultRender, resolveRoot = defaultResolveRoot}: Options = {},
  ) {
    this.render = render;
    this.resolveRoot = resolveRoot;
    this.mount();
  }

  act<T>(action: () => T, {update = true} = {}): T {
    const updateWrapper = update ? this.update.bind(this) : noop;
    let result!: T;

    if (this.acting) {
      result = action();
      updateWrapper();
      return result;
    }

    this.acting = true;

    /* act has two versions, act(() => void) or await act(async () => void)
     * The async version will wrap the inner async function so that it maintains an act
     * scope while it completes it's work asynchronously, and flushes updates to the
     * wrapper at the end.
     *
     * The non-async version will invoke the inner function synchronously and will flush
     * updates synchronously at the end.
     *
     * Typically the developer invokes act directly and knows which of these to use, but
     * since this is a generic act within Root it may get called with _either_ a synchronous
     * or asynchronous action. As a result, we can't naively await it, and instead have to
     * check the return value of result to determine if it needs awaiting so that it can
     * properly flush updates.
     */
    const possiblyAwaitableAct = act(() => {
      flushSync(() => {
        result = action();
      });

      if (isPromise(result)) {
        return result as unknown as Promise<void>;
      }

      return undefined as unknown as Promise<void>;
    });

    updateWrapper();

    if (isPromise(result)) {
      /* If the result has returned a promise, then we must first await the thenable object that
       * act returned (in order to clear the act scope and flush promises). Second, we must await
       * the result itself which is the purpose of this function - to perform act and return the
       * underlying result. Third, we must update the wrapper itself so that it remains consistent.
       */
      const getResultAsync = async () => {
        await possiblyAwaitableAct;
        const resolvedResultValue = await result;
        updateWrapper();
        this.acting = false;
        return resolvedResultValue;
      };
      return getResultAsync() as any;
    } else {
      /* If the result didn't return a promise, then the synchronous behaviour has already completed
       * and the synchronous version of act has too. Therefore it is safe to return the result directly.
       */
      this.acting = false;
      return result;
    }
  }

  html() {
    return this.withRoot((root) => root.html());
  }

  text() {
    return this.withRoot((root) => root.text());
  }

  is<Type extends React.ComponentType<any> | string>(
    type: Type,
  ): this is Root<PropsFor<Type>> {
    return this.withRoot((root) => root.is(type));
  }

  prop<K extends keyof Props>(key: K) {
    return this.withRoot((root) => root.prop(key));
  }

  data(key: string) {
    return this.withRoot((root) => root.data(key));
  }

  find<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ) {
    return this.withRoot((root) => root.find(type, props));
  }

  findAll<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ) {
    return this.withRoot((root) => root.findAll(type, props));
  }

  findWhere<Type extends React.ComponentType<any> | string | unknown = unknown>(
    predicate: Predicate,
  ) {
    return this.withRoot((root) => root.findWhere<Type>(predicate));
  }

  findAllWhere<
    Type extends React.ComponentType<any> | string | unknown = unknown,
  >(predicate: Predicate) {
    return this.withRoot((root) => root.findAllWhere<Type>(predicate));
  }

  trigger<K extends FunctionKeys<Props>>(
    prop: K,
    ...args: DeepPartialArguments<Props[K]>
  ): NonNullable<Props[K]> extends (...args: any[]) => any
    ? ReturnType<NonNullable<Props[K]>>
    : never {
    return this.withRoot((root) => root.trigger(prop, ...(args as any)));
  }

  triggerKeypath<
    Path extends string,
    ExtractedFunction extends KeyPathFunction = ExtractKeypath<Props, Path>,
  >(
    ...args: TriggerKeypathParams<Props, Path, ExtractedFunction>
  ): TriggerKeypathReturn<Props, Path, ExtractedFunction> {
    return this.withRoot((root) => root.triggerKeypath(...args));
  }

  mount() {
    if (this.mounted) {
      throw new Error('Attempted to mount a node that was already mounted');
    }

    if (this.element.parentNode == null) {
      document.body.appendChild(this.element);
      connected.add(this);
    }

    this.reactRoot = createRoot(this.element);

    this.act(() => {
      this.reactRoot!.render(
        <TestWrapper<Props>
          render={this.render}
          ref={(wrapper) => {
            this.wrapper = wrapper;
          }}
        >
          {this.tree}
        </TestWrapper>,
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
    this.act(() => this.reactRoot!.unmount());
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

  debug(options?: DebugOptions) {
    this.ensureRoot();
    return this.root!.debug(options);
  }

  toString() {
    return this.withRoot((root) => root.toString());
  }

  private update() {
    if (this.wrapper == null) {
      this.root = null;
    } else {
      const rootFiber = getInternals(this.wrapper.rootRef as any);
      const topElement = fiberToElement(
        findCurrentFiberUsingSlowPath(rootFiber),
        this,
      );

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

function defaultRender(element: React.ReactElement<unknown>) {
  return element;
}

function fiberToElement(
  node: Fiber,
  root: Root<unknown>,
): Element<unknown> | string {
  if (node.tag === Tag.HostText) {
    return node.memoizedProps as string;
  }

  const props = node.memoizedProps as any;
  const children = childrenToTree(node.child, root);

  return new Element(
    {
      tag: node.tag,
      type: node.type,
      props,
      instance: node.stateNode,
    },
    children,
    root,
  );
}

function childrenToTree(fiber: Fiber | null, root: Root<unknown>) {
  let currentFiber = fiber;
  const children: (string | Element<unknown>)[] = [];

  while (currentFiber != null) {
    const result = fiberToElement(currentFiber, root);
    children.push(result);
    currentFiber = currentFiber.sibling;
  }

  return children;
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof (value as any).then === 'function'
  );
}

function noop() {}
