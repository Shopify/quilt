import {ReactElement} from 'react';
import {Resolver} from '@shopify/async';
import {IfAllOptionalKeys} from '@shopify/useful-types';

export enum AssetTiming {
  None = 1,
  NextPage = 2,
  CurrentPage = 3,
  Immediate = 4,
}

export interface AsyncComponentType<
  T,
  Props extends object,
  PreloadOptions extends object,
  PrefetchOptions extends object,
  KeepFreshOptions extends object
> {
  readonly resolver: Resolver<T>;
  (props: Props): ReactElement<Props>;
  Preload(props: PreloadOptions): React.ReactElement<{}> | null;
  Prefetch(props: PrefetchOptions): React.ReactElement<{}> | null;
  KeepFresh(props: KeepFreshOptions): React.ReactElement<{}> | null;
  usePreload(
    ...props: IfAllOptionalKeys<
      PreloadOptions,
      [PreloadOptions?],
      [PreloadOptions]
    >
  ): () => void;
  usePrefetch(
    ...props: IfAllOptionalKeys<
      PrefetchOptions,
      [PrefetchOptions?],
      [PrefetchOptions]
    >
  ): () => void;
  useKeepFresh(
    ...props: IfAllOptionalKeys<
      KeepFreshOptions,
      [KeepFreshOptions?],
      [KeepFreshOptions]
    >
  ): () => void;
}

export type PreloadOptions<T> = T extends AsyncComponentType<
  any,
  any,
  infer U,
  any,
  any
>
  ? U
  : never;

export type PrefetchOptions<T> = T extends AsyncComponentType<
  any,
  any,
  infer U,
  any,
  any
>
  ? U
  : never;

export type KeepFreshOptions<T> = T extends AsyncComponentType<
  any,
  any,
  infer U,
  any,
  any
>
  ? U
  : never;
