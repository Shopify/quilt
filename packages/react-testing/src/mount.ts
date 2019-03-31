import * as React from 'react';
import {IfAllOptionalKeys} from '@shopify/useful-types';

import {Root} from './root';
import {Element} from './element';

export {Root, Element};

export function mount<Props>(element: React.ReactElement<Props>) {
  return new Root<Props>(element);
}

type AfterMountOption<
  MountOptions extends object,
  Context extends object,
  Async extends boolean
> = Async extends true
  ? {
      afterMount(
        wrapper: CustomRoot<unknown, Context>,
        options: MountOptions,
      ): PromiseLike<void>;
    }
  : {
      afterMount?(
        wrapper: CustomRoot<unknown, Context>,
        options: MountOptions,
      ): void;
    };

type ContextOption<
  MountOptions extends object,
  Context extends object
> = IfAllOptionalKeys<
  Context,
  {
    context?(options: MountOptions): Context;
  },
  {
    context(options: MountOptions): Context;
  }
>;

export type CustomMountOptions<
  MountOptions extends object = {},
  Context extends object = {},
  Async extends boolean = false
> = {
  render(
    element: React.ReactElement<any>,
    context: Context,
    options: MountOptions,
  ): React.ReactElement<any>;
} & ContextOption<MountOptions, Context> &
  AfterMountOption<MountOptions, Context, Async>;

type CustomMount<
  MountOptions extends object,
  Context extends object,
  Async extends boolean
> = IfAllOptionalKeys<
  MountOptions,
  <Props>(
    element: React.ReactElement<any>,
    options?: MountOptions,
  ) => CustomMountResult<Props, Context, Async>,
  <Props>(
    element: React.ReactElement<any>,
    options: MountOptions,
  ) => CustomMountResult<Props, Context, Async>
>;

type CustomMountResult<
  Props,
  Context extends object,
  Async extends boolean
> = Async extends true
  ? Promise<CustomRoot<Props, Context>>
  : CustomRoot<Props, Context>;

class CustomRoot<Props, Context extends object> extends Root<Props> {
  constructor(
    tree: React.ReactElement<Props>,
    public readonly context: Context,
    resolve: (element: Element<unknown>) => Element<unknown> | null,
  ) {
    super(tree, resolve);
  }
}

export function createMount<
  MountOptions extends object = {},
  Context extends object = {},
  Async extends boolean = false
>({
  render,
  context: createContext = defaultContext,
  afterMount = defaultAfterMount,
}: CustomMountOptions<MountOptions, Context, Async>): CustomMount<
  MountOptions,
  Context,
  Async
> {
  function mount<Props>(
    element: React.ReactElement<Props>,
    options: MountOptions = {} as any,
  ) {
    const context = createContext(options);
    const rendered = render(element, context, options);

    const wrapper = new CustomRoot(rendered, context, root =>
      root.find(element.type),
    );

    const afterMountResult = afterMount(wrapper, options);

    return afterMountResult != null && 'then' in afterMountResult
      ? afterMountResult.then(() => wrapper)
      : wrapper;
  }

  return mount as any;
}

function defaultContext() {
  return {} as any;
}

function defaultAfterMount() {}
