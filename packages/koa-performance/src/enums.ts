export enum LifecycleMetric {
  TimeToFirstByte = 'time_to_first_byte',
  TimeToFirstContentfulPaint = 'time_to_first_contentful_paint',
  TimeToFirstPaint = 'time_to_first_paint',
  DomContentLoaded = 'dom_content_loaded',
  FirstInputDelay = 'first_input_delay',
  Load = 'dom_load',
}

export enum NavigationMetric {
  Complete = 'navigation_complete',
  Usable = 'navigation_usable',
  DownloadSize = 'navigation_download_size',
  CacheEffectiveness = 'navigation_cache_effectiveness',
}
