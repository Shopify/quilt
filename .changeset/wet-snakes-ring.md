---
'@shopify/react-hooks': patch
---

Addressed a bug with useMountedRef for React 18 Strict Mode in development where mounted.current would be false after the effect runs for the first time.
