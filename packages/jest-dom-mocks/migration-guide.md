# Migration guide

This is a concise summary of changes and recommendations around updating `@shopify/jest-dom-mocks` in consuming projects. For a more detailed list of changes, see [the changelog](./CHANGELOG.md).

## [3.0.0]

🛑 Breaking change - The `fetchedUrl` from `lastCall()` includes a trailing slash which may cause tests to fail.

### Before

```javascript
const [fetchedUrl, {body, method, headers}] = fetch.lastCall();
expect(fetchedUrl).toBe('https://www.shopify.com');
```

### After

```javascript
const [fetchedUrl, {body, method, headers}] = fetch.lastCall();
expect(fetchedUrl).toBe('https://www.shopify.com/');
```
