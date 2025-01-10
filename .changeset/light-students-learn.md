---
'@shopify/dates': patch
---

Correctly support deprecated timezones in older browsers when calling `formatDate()`. For example, modern browsers support both `Europe/Kyiv` and (the now deprecated) `Europe/Kiev`, but browsers as recent as Chrome 131 on MacOS only support `Europe/Kiev`. Note: This is a purely internal change which should not effect the result of calling `formatDate()`.
