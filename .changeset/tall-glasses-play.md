---
'@shopify/react-router': major
---

`@shopify/react-router` is now `react-router` v6 compatible; support for `react-router` v5 is dropped. In order to distinguish what comes from `react-router-dom` and what comes from `@shopify/react-router`, we have removed re-exports from `react-router-dom`. `react-router-dom` is now a peer dependency of this package. The `Link` component has been removed.

Consumers should add `react-router-dom` as a dependency alongside `@shopify/react-router`, and all imports aside from `Router` and `Redirect` should be updated to imported from `react-router-dom`. See [Polaris' documentation](https://polaris.shopify.com/components/app-provider#using-link-component) for how to create a meaningful `Link` component that handles external urls.
