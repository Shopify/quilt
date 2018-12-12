import {ReactInstance, ReactNode} from 'react';

export type Tree = ReactNode;
export type Context = any;
export interface Infuser {
  (
    element: ReactNode,
    instance: ReactInstance | null,
    context: Context,
    childContext?: Context,
  ): any;
}
