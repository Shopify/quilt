import React from 'react';
import {IfAllOptionalKeys} from '@shopify/useful-types';

import {Root, Options as RootOptions} from './root';
import {Element} from './element';

export {Root, Element};

export function mount<Props>(element: React.ReactElement<Props>) {
  return new Root<Props>(element);
}

type AfterMountOption<
  MountOptions extends object,
  Context extends object,
  Async extends boolean,
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
  Context extends object,
> = IfAllOptionalKeys<
  Context,
  {
    context?(options: MountOptions): Context;
  },
  {
    context(options: MountOptions): Context;
  }
>;

interface Cleanup<MountOptions extends object, Context extends object> {
  cleanup?(wrapper: CustomRoot<unknown, Context>, options: MountOptions): void;
}

export type CustomMountOptions<
  MountOptions extends object = {},
  CreateContext extends object = {},
  Context extends object = CreateContext,
  Async extends boolean = false,
> = {
  render(
    element: React.ReactElement<any>,
    context: Context,
    options: MountOptions,
  ): React.ReactElement<any>;
} & ContextOption<MountOptions, CreateContext> &
  AfterMountOption<MountOptions, Context, Async> &
  Cleanup<MountOptions, Context>;

export interface CustomMount<
  MountOptions extends object,
  Context extends object,
  Async extends boolean,
> {
  <Props>(
    ...args: IfAllOptionalKeys<
      MountOptions,
      [React.ReactElement<any>, MountOptions?],
      [React.ReactElement<any>, MountOptions]
    >
  ): CustomMountResult<Props, Context, Async>;
  extend<
    AdditionalMountOptions extends object = {},
    AdditionalContext extends object = {},
    AdditionalAsync extends boolean = false,
  >(
    options: CustomMountOptions<
      MountOptions & AdditionalMountOptions,
      AdditionalContext,
      Context & AdditionalContext,
      AdditionalAsync
    >,
  ): CustomMount<
    MountOptions & AdditionalMountOptions,
    Context & AdditionalContext,
    AdditionalAsync extends true ? AdditionalAsync : Async
  >;
}

type CustomMountResult<
  Props,
  Context extends object,
  Async extends boolean,
> = Async extends true
  ? Promise<CustomRoot<Props, Context>>
  : CustomRoot<Props, Context>;

export class CustomRoot<Props, Context extends object> extends Root<Props> {
  constructor(
    tree: React.ReactElement<Props>,
    public readonly context: Context,
    options?: RootOptions,
  ) {
    super(tree, options);
  }
}

export function createMount<
  MountOptions extends object = {},
  Context extends object = {},
  Async extends boolean = false,
>({
  render,
  context: createContext = defaultContext,
  afterMount = defaultAfterMount,
  cleanup,
}: CustomMountOptions<MountOptions, Context, Context, Async>): CustomMount<
  MountOptions,
  Context,
  Async
> {
  function mount<Props>(
    element: React.ReactElement<Props>,
    options: MountOptions = {} as any,
  ) {
    const context = createContext(options);

    const wrapper = new CustomRoot(element, context, {
      render: (element) => render(element, context, options),
      resolveRoot: (root) => root.find(element.type),
    });

    if (cleanup) {
      const originalDestroy = wrapper.destroy.bind(wrapper);
      wrapper.destroy = () => {
        cleanup(wrapper, options);
        return originalDestroy();
      };
    }

    const afterMountResult = afterMount(wrapper, options);

    return afterMountResult != null && 'then' in afterMountResult
      ? afterMountResult.then(() => wrapper)
      : wrapper;
  }

  Reflect.defineProperty(mount, 'extend', {
    writable: false,
    value: ({
      context: createAdditionalContext = defaultContext,
      render: additionalRender,
      afterMount: additionalAfterMount = defaultAfterMount,
    }: CustomMountOptions<any, any, any, any>) => {
      return createMount<any, any, any>({
        context: (options) => ({
          ...createContext(options),
          ...createAdditionalContext(options),
        }),
        render: (element, context, options) =>
          render(additionalRender(element, context, options), context, options),
        afterMount: (wrapper, options) => {
          const result = additionalAfterMount(wrapper, options);
          const finalResult = () => afterMount(wrapper, options);

          return result != null && 'then' in result
            ? result.then(finalResult)
            : finalResult();
        },
      });
    },
  });

  return mount as any;
}

function defaultContext() {
  return {} as any;
}

function defaultAfterMount() {}
