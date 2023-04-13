---
'@shopify/react-server': major
---

Updates React.hydrate -> React.hydrateRoot

## Breaking Change Summary

Hydrating has been updated to support React.hydrateRoot. Apps that do not yet support React 18 will need to update to React 18 before updating to this version.

React 17 supports concurrent rendering, which requires a new API for hydrating the server-rendered HTML. This PR updates the `react-server` package to use the new API.

## How to 🎩

- https://react.dev/blog/2022/03/08/react-18-upgrade-guide
