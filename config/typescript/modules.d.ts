declare module 'url' {
  interface URLDetails {
    pathname: string;
  }

  export function parse(url: string): URLDetails;
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
