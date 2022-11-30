---
'@shopify/graphql-testing': minor
---

Improve error that is thrown when you test a GraphQL operation that has not been mocked. It now details what mock was absent.

Calling `createGraphQL()` with no argument now results in the operation returning a NetworkError. This makes it consistent with the error that results from `createGraphQL({})`.
