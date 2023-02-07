---
'@shopify/react-graphql': minor
---

`extends {}` has been added to the `Data` / `Variables` / `DeepPartial` generic types on the `useQuery` and `useGraphQLDocument` hooks, the `createAsyncQuery`,`createAsyncQueryComponent` functions and the `Query` component. If you use typescript's `strictNullChecks` option and define functions that contain generics that are then passed into any of these functions you may need add an `extends {}` to your code as well, per [the typescript 4.8 changelog](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to). For example, replace `<Data>` with `<Data extends {}>`.
