---
'@shopify/react-testing': major
---

WHAT: Release act promises when root wrapper is destroyed
WHY: To prevent unresolved promises from failing subsequent act calls
HOW: `destroyAll` in `afterEach` will now have to be awaited as well as `Root.prototype.destroy`
