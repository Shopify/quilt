export type LocationOrHref =
  | string
  | {search: string; hash: string; pathname: string};
