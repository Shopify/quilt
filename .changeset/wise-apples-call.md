---
'@shopify/react-testing': major
---

React `act` promise queues are now emptied when root wrappers are destroyed. This prevents unresolved promises from causing stuck queues and thus failures in subsequent test cases.

The `destroyAll()` and `root.destroy()` functions are now asynchronous and return promises. Calls to either of these functions must now be `await`ed.

```diff
- destroyAll()
+ await destroyAll()
```
