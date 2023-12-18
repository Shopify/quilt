---
'@shopify/dates': patch
---

The code change addresses a issue that occurred when the user selected the 'GMT' timezone. The crash was resolved by adding a fallback to 'UTC' timezone when 'GMT' is selected.
