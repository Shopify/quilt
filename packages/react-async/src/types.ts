import {ReactElement} from 'react';
import {Resolver} from '@shopify/async';
import {IfAllOptionalKeys, NoInfer} from '@shopify/useful-types';

export enum AssetTiming {
  None = 1,
  NextPage = 2,
  CurrentPage = 3,
  Immediate = 4,
}

export interface AsyncHookTarget<
  T,
  PreloadOptions extends object,
  PrefetchOptions extends object,
  KeepFreshOptions extends object
> {
  readonly resolver: Resolver<T>;
  usePreload(
    ...props: IfAllOptionalKeys<
      PreloadOptions,
      [NoInfer<PreloadOptions>?],
      [NoInfer<PreloadOptions>]
    >
  ): () => void;
  usePrefetch(
    ...props: IfAllOptionalKeys<
      PrefetchOptions,
      [NoInfer<PrefetchOptions>?],
      [NoInfer<PrefetchOptions>]
    >
  ): () => void;
  useKeepFresh(
    ...props: IfAllOptionalKeys<
      KeepFreshOptions,
      [NoInfer<KeepFreshOptions>?],
      [NoInfer<KeepFreshOptions>]
    >
  ): () => void;
}

export interface AsyncComponentType<
  T,
  Props extends object,
  PreloadOptions extends object,
  PrefetchOptions extends object,
  KeepFreshOptions extends object
>
  extends AsyncHookTarget<
    T,
    PreloadOptions,
    PrefetchOptions,
    KeepFreshOptions
  > {
  (props: Props): ReactElement<Props>;
  Preload(props: PreloadOptions): React.ReactElement<{}> | null;
  Prefetch(props: PrefetchOptions): React.ReactElement<{}> | null;
  KeepFresh(props: KeepFreshOptions): React.ReactElement<{}> | null;
}

export type PreloadOptions<T> = T extends AsyncHookTarget<
  any,
  infer U,
  any,
  any
>
  ? U
  : never;

export type PrefetchOptions<T> = T extends AsyncHookTarget<
  any,
  any,
  infer U,
  any
>
  ? U
  : never;

export type KeepFreshOptions<T> = T extends AsyncHookTarget<
  any,
  any,
  any,
  infer U
>
  ? U
  : never;
