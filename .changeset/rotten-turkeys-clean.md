---
'@shopify/admin-graphql-api-utilities': minor
---

`composeGid` and`composeGidFactory` now return the types `ShopifyGid` and `Gid` respectively. These are template literal types that enforce that the returned string looks like a Gid (i.e. it is a string that looks like "gid://NAMESPACE/TYPE/VALUE`). Adds `isGidFactory`and`isGid` utility functions.
