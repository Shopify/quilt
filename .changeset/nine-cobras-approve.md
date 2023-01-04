---
'@shopify/statsd': minor
---

Introduces an optional parameter to all metrics methods to allow them to accept
a sampleRate and provide sampling independently of the sampleRate settings
specified on the client itself. Allows the developer to opt in or out of
sampling on a metric-by-metric basis.
