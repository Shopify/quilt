// window.perfMetrics is created by a polyfill that *must* be injected into
// the document head
// (see https://github.com/GoogleChromeLabs/first-input-delay).

interface PerfMetrics {
  onFirstInputDelay(handler: (duration: number, event: Event) => void): void;
}

interface Window {
  perfMetrics?: PerfMetrics;
}
