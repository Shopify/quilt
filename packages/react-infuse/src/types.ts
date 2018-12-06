import {ReactElement, ReactInstance} from 'react';

export type Tree = ReactElement<any>;
export type Context = any;
export interface Infuser {
  (
    element: ReactElement<any>,
    instance: ReactInstance | null,
    context: Context,
    childContext?: Context,
  ): Promise<any>;
}
