---
'graphql-fixtures': minor
---

Add a new function `createFillers`. The function return an object containing `fillOperation` and `fillFragment`. It's now possible to fill a fragment without a query. You can replace `createFiller` by `createFillers` if you need to be able to fill fragments.
