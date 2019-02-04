export type Import<T> = T | {default: T};

export interface LoadProps<T> {
  id?(): string;
  load(): Promise<Import<T>>;
}
