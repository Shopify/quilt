import {ComponentType} from 'react';
import {Props} from '@shopify/useful-types';

import {toHaveReactProps} from './props';
import {toContainReactComponent} from './components';
import {toContainReactText, toContainReactHtml} from './strings';
import {Node} from './types';

type PropsFromNode<T> = T extends Node<infer U> ? U : never;

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveReactProps(props: Partial<PropsFromNode<R>>): void;
      toContainReactComponent<Type extends string | ComponentType<any>>(
        type: Type,
        props?: Partial<Props<Type>>,
      ): void;
      toContainReactText(text: string): void;
      toContainReactHtml(text: string): void;
    }
  }
}

expect.extend({
  toHaveReactProps,
  toContainReactComponent,
  toContainReactText,
  toContainReactHtml,
});
