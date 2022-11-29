---
'graphql-fixtures': patch
'graphql-mini-transforms': patch
'@shopify/jest-dom-mocks': patch
'@shopify/react-async': patch
'@shopify/react-form-state': patch
'@shopify/react-graphql': patch
'@shopify/react-idle': patch
'@shopify/react-import-remote': patch
'@shopify/react-server': patch
'@shopify/react-testing': patch
---

Update types to account changes in TypeScript 4.8 and 4.9. [Propogate contstraints on generic types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to) and update type usage relating to `Window` and `Navigator`. Technically this makes some types stricter, as attempting to pass `null|undefined` into certain functions is now disallowed by TypeScript, but these were never expected runtime values in the first place.
