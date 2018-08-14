declare module 'url' {
  interface URLDetails {
    pathname: string;
  }

  export function parse(url: string): URLDetails;
}

declare module 'enzyme-adapter-react-16' {
  class Adaptor {}
  export = Adaptor;
}

declare module 'react-tree-walker' {
  import * as React from 'react';

  export interface Visitor {
    (
      element: React.ReactElement<any>,
      instance: React.Component<any> | null,
      context?: object,
    ): any;
  }

  export default function reactTreeWalker(
    rootElement: React.ReactElement<any>,
    visitor: Visitor,
    rootContext?: object,
    options?: {componentWillUnmount: boolean},
  ): Promise<void>;
}
