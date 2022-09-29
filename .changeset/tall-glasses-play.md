---
'@shopify/react-router': major
---

`@shopify/react-router` is now `react-router` v6 compatible; support for `react-router` v5 is dropped. In order to make it clearer what comes from `react-router-dom`, and what comes from `@shopify/react-router` we have removed reexports from `react-router-dom`. `react-router-dom` is now a peer dependency of this package. The `Link` component has been removed.

Consumers should add `react-router-dom` as a dependency alongside `@shopify/react-router`, and all imports aside from `Router` and `Redirect` should updated to imported from `react-router-dom`.
