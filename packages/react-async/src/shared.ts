export type Prefetchable<Props> =
  | {
      Prefetch: React.ComponentType<Props>;
    }
  | React.ComponentType<Props>;

export enum PreloadPriority {
  None,
  CurrentPage,
  NextPage,
}
