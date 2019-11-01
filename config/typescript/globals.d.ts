// This type duplicates TypeScript’s `Omit`, because some of our dependencies
// assume TS 3.5+, which added this as a global type. Once we upgrade TypeScript,
// we can safely remove this type.
// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
