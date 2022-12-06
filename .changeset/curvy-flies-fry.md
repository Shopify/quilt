---
'@shopify/statsd': patch
---

When using a child client concatenation of prefixes is now ordered as `ParentPrefix.ChildPrefix`, which is a more generally desired behaviour. Previously this was `ChildPrefix.ParentPrefix`.
