---
'@shopify/react-testing': major
---

React `act` promises are now released when root wrappers are destroyed. This prevents unresolved promises from causing failures in subsequent `act` calls in other tests.

The `destroyAll()` and `root.destroy()` functions are now asynchronous and return promises. Calls to either of these functions must now be `await`ed.

```diff
- destroyAll()
+ await destroyAll()
```
