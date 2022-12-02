---
'@shopify/graphql-testing': minor
---

Deliberatly cause a `NetworkError` with a useful error message if we see a fixture that is a function that returns a function. This can happen if you do `createGraphQL({MyQuery: () => fillGraphQL(MyQuery)})` because fillGraphQL returns a function. Apollo 2 already returns a `NetworkError` if you do this but as it happens later on, the error message was much less helpful.
