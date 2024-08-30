---
'@shopify/graphql-testing': patch
---

MockGraphQLResponse should allow an ExecutionResult containing any data.
GraphQL v15 defaulted ExecutionResult's data to be an object containing any keys
but v16 narrowed that down to use `unknown` instead of `any`. This change
explicitly uses the default behaviour of allowing any from v15.
