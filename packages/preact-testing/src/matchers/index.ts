import {ComponentType, Context as ReactContext} from 'preact';

import {Node, PropsFor} from '../types';

import {toHaveReactProps, toHaveReactDataProps} from './props';
import {
  toContainPreactComponent,
  toContainReactComponentTimes,
} from './components';
import {toProvideReactContext} from './context';
import {toContainReactText, toContainReactHtml} from './strings';

type PropsFromNode<T> = T extends Node<infer U> ? U : never;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T = {}> {
      toHavePreactProps(props: Partial<PropsFromNode<T>>): void;
      toHavePreactDataProps(data: {[key: string]: string}): void;
      toContainPreactComponent<Type extends string | ComponentType<any>>(
        type: Type,
        props?: Partial<PropsFor<Type>>,
      ): void;
      toContainPreactComponentTimes<Type extends string | ComponentType<any>>(
        type: Type,
        times: number,
        props?: Partial<PropsFor<Type>>,
      ): void;
      toProvideReactContext<Type>(
        context: ReactContext<Type>,
        value?: Type,
      ): void;
      toContainReactText(text: string): void;
      toContainReactHtml(text: string): void;
    }
  }
}

expect.extend({
  toHaveReactProps,
  toHaveReactDataProps,
  toContainPreactComponent,
  toContainReactComponentTimes,
  toContainReactText,
  toContainReactHtml,
  toProvideReactContext,
});
