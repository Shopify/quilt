import {ComponentType} from 'react';

export type ThenType<T> = T extends Promise<infer U> ? U : T;
export type FirstArgument<T> = T extends ((arg: infer U) => any) ? U : never;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Props<T> = T extends ComponentType<infer P> ? P : never;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};
