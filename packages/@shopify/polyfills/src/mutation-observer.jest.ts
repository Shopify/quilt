// We don’t want to polyfill if we are dealing with non-browser
// environments
if (typeof window !== 'undefined') {
  require('mutationobserver-shim');
}
