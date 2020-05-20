# FAQ

### What are the scaling problems this gem has?

For a detail description of the current architecture's problems, see [this Github comment](https://github.com/Shopify/quilt/issues/1059#issuecomment-539195340).

A ["scalable quilt_rails architecture"](https://github.com/Shopify/quilt/issues/1100) was figured out for internal Shopify use.

For external users, you can should skip server-side queries in your components. e.g.:

```ts
useQuery(MyQuery, {
  skip: typeof document === 'undefined',
});
```
