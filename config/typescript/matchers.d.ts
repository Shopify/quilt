import {ComponentType, Context as ReactContext} from 'react';

// @shopify/react-testing/matchers
declare type PropsFromNode<T> = T extends Node<infer U> ? U : never;
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
    }
  }
}

// saddle-up/matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T = {}> {
      toHaveBodyJson(json: any): Promise<void>;
      toHaveBodyText(text: string): Promise<void>;
      toHaveStatus(status: number): Promise<void>;
      toHaveHeaders(headers: {[key: string]: string}): Promise<void>;
      toHaveStatusText(status: string): Promise<void>;
      toHaveSetCookie(cookieName: string, value?: string): Promise<void>;
      toHaveCookies(cookies: {[key: string]: string}): Promise<void>;
    }
  }
}

// saddle-up/koa-matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T = {}> {
      toHaveKoaState(state: any): Promise<void>;
    }
  }
}
