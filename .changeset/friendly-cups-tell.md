---
'@shopify/react-graphql': major
---

Use loading=true from server-side-rendered queries when ssr is set to false

This is for consistency with the way that Apollo does things and to ensure that
we avoid hydration mismatch errors when the client will initially render with
true while the server rendered with false.

Functionally, this means that if you previously relied on loading=false in your
component code as an indication of server side rendering with an ssr false
value, you should instead make use of the "called" value to determine whether
or not it was called (this will still be false).
