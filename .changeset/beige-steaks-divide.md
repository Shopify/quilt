---
'@shopify/jest-koa-mocks': major
---

Update node-mocks-http, fixing response.getHeaders() behaviour

response.getHeaders() had a flawed implementation where it exposed the
underlying headers object, allowing it to be mutated in tests directly.
https://github.com/howardabrams/node-mocks-http/pull/217 fixes that issue by
returning a shallow copy so that the underlying headers object cannot be
directly mutated.
