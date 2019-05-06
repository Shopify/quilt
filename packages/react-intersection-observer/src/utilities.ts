export function isSupported() {
  return (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in IntersectionObserverEntry.prototype
  );
}
