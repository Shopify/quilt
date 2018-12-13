import {ReactInstance, ReactNode} from 'react';

export type Tree = ReactNode;
export type Context = any;
export interface Visitor {
  (
    element: ReactNode,
    instance: ReactInstance | null,
    context: Context,
    childContext?: Context,
  ): any;
}
