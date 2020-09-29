export function isServer() {
  return typeof window === 'undefined';
}

export function isClient() {
  return !isServer();
}
