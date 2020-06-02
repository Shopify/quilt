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

### I run into webpacker issue while setting up `quilt_rails`

We suggest using webpack or [@shopify/sewing-kit](https://github.com/Shopify/sewing-kit) instead of webpacker with `quilt_rails` for JavaScript build.

Remove webpacker by running `bundle remove webpacker` and remove any webpacker configuration files (`config/webpack` and `config/webpacker.yml`).
