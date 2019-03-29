import {ComponentType} from 'react';
import {Props} from '@shopify/useful-types';

import {toHaveReactProp, toHaveReactProps} from './props';
import {toContainReactComponent} from './components';
import {Node} from './types';

type PropsFromNode<T> = T extends Node<infer U> ? U : never;

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveReactProp<Prop extends keyof PropsFromNode<R>>(
        prop: Prop,
        value?: PropsFromNode<R>[Prop],
      ): void;
      toHaveReactProps(props: Partial<PropsFromNode<R>>): void;
      toContainReactComponent<Type extends string | ComponentType<any>>(
        type: Type,
        props?: Partial<Props<Type>>,
      ): void;
    }
  }
}

expect.extend({toHaveReactProp, toHaveReactProps, toContainReactComponent});
