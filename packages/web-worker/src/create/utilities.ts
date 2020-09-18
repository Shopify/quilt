export type FileOrModuleResolver<T> = () => Promise<T> | string;

export function createScriptUrl(script: FileOrModuleResolver<any>) {
  return typeof window === 'undefined' || typeof script !== 'string'
    ? undefined
    : new URL(script, window.location.href);
}
