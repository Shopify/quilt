declare module 'url' {
  interface URLDetails {
    pathname: string;
  }

  export function parse(url: string): URLDetails;
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
