---
'graphql-fixtures': minor
'graphql-mini-transforms': minor
'@shopify/jest-dom-mocks': minor
'@shopify/react-async': minor
'@shopify/react-form-state': minor
'@shopify/react-graphql': minor
'@shopify/react-idle': minor
'@shopify/react-import-remote': minor
'@shopify/react-server': minor
'@shopify/react-testing': minor
---

Update types to account changes in TypeScript 4.8 and 4.9. [Propogate contstraints on generic types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to) and update type usage relating to `Window` and `Navigator`. Technically this makes some types stricter, as attempting to pass `null|undefined` into certain functions is now disallowed by TypeScript, but these were never expected runtime values in the first place.
