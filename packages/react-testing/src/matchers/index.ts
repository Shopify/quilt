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
      toHaveFocus(): void;
      toBeDisabled(): void;
      toHaveValue(value: string | boolean): void;
    }
  }
}

function toBeInDocument(this: jest.MatcherUtils, element: HTMLElement | null) {
  if (!element) {
    return {
      message: () =>
        `expected HTMLElement or Node to be in the document, but received null`,
      pass: false,
    };
  }
  const pass = document.body.contains(element);
  return {
    message: () => `expected element to be in the document`,
    pass,
  };
}

function toHaveFocus(this: jest.MatcherUtils, element: HTMLElement | null) {
  if (!element) {
    return {
      message: () =>
        `expected HTMLElement or Node to be in document, but received null`,
      pass: false,
    };
  }
  const pass = document.activeElement === element;
  return {
    message: () => `expected element to have focus`,
    pass,
  };
}

function toHaveValue(
  this: jest.MatcherUtils,
  received: HTMLElement,
  value: string | boolean,
) {
  let pass = false;
  if (received instanceof HTMLInputElement) {
    switch (received.type) {
      case 'text':
        pass = received.value === value;
        break;
      case 'checkbox':
        pass = received.checked === value || received.value === value;
        break;
      case 'radio':
        pass = received.checked === value || received.value === value;
        break;
      default:
        throw new Error(`toHaveValue does not support ${received.type}`);
    }
  } else if (
    received instanceof HTMLSelectElement ||
    received instanceof HTMLTextAreaElement
  ) {
    pass = received.value === value;
  }
  return {
    message: () => `expected input to have value "${value}"`,
    pass,
  };
}

function toBeDisabled(this: jest.MatcherUtils, received: HTMLElement) {
  const pass = toHaveAttribute.bind(this)(received, 'disabled').pass;
  return {
    message: () => `expected element to be disabled`,
    pass,
  };
}

function toHaveAttribute(
  this: jest.MatcherUtils,
  received: HTMLElement,
  attr: string,
  value?: string,
) {
  const pass = received.hasAttribute(attr);
  if (value) {
    return {
      message: () =>
        `expected element to have attribute "${attr}" with value "${value}"`,
      pass: pass && received.getAttribute(attr) === value,
    };
  }
  return {
    message: () => `expected element to have attribute "${attr}"`,
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
  toHaveFocus,
  toHaveValue,
  toBeDisabled,
});
