---
'@shopify/react-performance': major
---

Default to only sending metrics for "Finished" navigations

usePerformanceReport and PerformanceReport will now default to only sending
navigations in the performance report that have been completed (ie. have
rendered a PerformanceMark or usePerformanceMark with Stage.Complete).

This reduces the likelihood of evaluating your metrics incorrectly.
