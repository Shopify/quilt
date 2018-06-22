# We use `hot-shots` as our DogStatsD client

## Date

May 18, 2018

## Contributors

* tzvipm

## Summary

We use `hot-shots` as our DogStatsD client. It is regularly updated based on `etsy/statsd`, and has a rigorous test suite including performance tests. These characteristics make it stand out compared to alternative solutions.

## Problem space

We need to submit metrics to DataDog.

## Solution

We submit metrics to datadog via dogstatsd, based on the [DataDog Developer Documentation](https://docs.datadoghq.com/developers/dogstatsd/):

> The easiest way to get your custom application metrics into Datadog is to send them to DogStatsD, a metrics aggregation service bundled with the Datadog Agent.

This same documentation provides a [list of libraries in various programming languages](https://docs.datadoghq.com/developers/libraries/).

Among those, there are 2 libraries listed under `Node.js` with support for `DogStatsD`:

* `hot-shots`
* `node-dogstatsd`

`hot-shots` appears to be the clear choice between these 2 for the following reasons:

1.  security - It is actively maintained
2.  reliability - It has a test suite
3.  performance - It has performance tests
