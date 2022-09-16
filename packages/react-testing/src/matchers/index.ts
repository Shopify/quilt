import {ComponentType, Context as ReactContext} from 'react';

import {Node, PropsFor} from '../types';

import {toHaveReactProps, toHaveReactDataProps} from './props';
import {
  toContainReactComponent,
  toContainReactComponentTimes,
} from './components';
import {toProvideReactContext} from './context';
import {toContainReactText, toContainReactHtml} from './strings';

type PropsFromNode<T> = T extends Node<infer U> ? U : never;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Result {
      pass: boolean;
      message(): string;
    }

    type PartialResult<T> = {
      [P in keyof T]?: T[P] | Result;
    };
    interface Matchers<R, T = {}> {
      toHaveReactProps(props: PartialResult<PropsFromNode<T>>): void;
      toHaveReactDataProps(data: {[key: string]: string}): void;
      toContainReactComponent<Type extends string | ComponentType<any>>(
        type: Type,
        props?: PartialResult<PropsFor<Type>>,
      ): void;
      toContainReactComponentTimes<Type extends string | ComponentType<any>>(
        type: Type,
        times: number,
        props?: PartialResult<PropsFor<Type>>,
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
  toContainReactComponent,
  toContainReactComponentTimes,
  toContainReactText,
  toContainReactHtml,
  toProvideReactContext,
});
