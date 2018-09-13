export interface GaJSAnalytics {
  push(event: any[]): void;
}

export interface UniversalAnalytics {
  (event: string, ...args: any[]): void;
}
