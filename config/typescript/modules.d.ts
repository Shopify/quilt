declare module 'url' {
  interface URLDetails {
    pathname: string;
  }

  export function parse(url: string): URLDetails;
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

declare module 'browser-unhandled-rejection' {
  const auto: Function;
  export {auto};
}

declare module 'browserslist-useragent' {
  interface Options {
    browsers?: any;
    env?: string;
    ignorePatch?: boolean;
    ignoreMinor?: boolean;
    allowHigherVersions?: boolean;
  }

  export function matchesUA(ua: string, options?: Options): boolean;
}
