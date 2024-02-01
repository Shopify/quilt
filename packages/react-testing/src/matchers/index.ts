import type {ComponentType, Context as ReactContext} from 'react';

import type {Node, PropsFor} from '../types';

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
    interface Matchers<R, T = {}> {
      toHaveReactProps(props: Partial<PropsFromNode<T>>): void;
      toHaveReactDataProps(data: {[key: string]: string}): void;
      toContainReactComponent<Type extends string | ComponentType<any>>(
        type: Type,
        props?: Partial<PropsFor<Type>>,
      ): void;
      toContainReactComponentTimes<Type extends string | ComponentType<any>>(
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
      toBeInDocument(): void;
    }
  }
}

function toBeInDocument(
  this: jest.MatcherUtils,
  received: HTMLElement | Node<unknown> | null,
) {
  const element =
    received instanceof HTMLElement ? received : received?.domNode;
  if (!element) {
    return {
      message: () =>
        `expected HTMLElement or Node to be in the document, but received null`,
      pass: false,
    };
  }
  const pass = document.body.contains(element);
  return {
    message: () => `expected element not to be in the document`,
    pass,
  };
}

expect.extend({
  toHaveReactProps,
  toHaveReactDataProps,
  toContainReactComponent,
  toContainReactComponentTimes,
  toContainReactText,
  toContainReactHtml,
  toProvideReactContext,
  toBeInDocument,
});
