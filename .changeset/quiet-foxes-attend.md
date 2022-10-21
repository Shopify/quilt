---
'@shopify/react-i18n': minor
---

Update currency symbol formatting to follow Polaris localized currency formatting guidelines. No longer displays a character or ISO code beside the currency symbol, for certain currencies and locales. The following table summarizes the changes, assuming a locale of `en-US`:

| Method                                                        | Previous output                  | New output                      |
| ------------------------------------------------------------- | -------------------------------- | ------------------------------- |
| `i18n.formatCurrency(2, {currency: 'AUD', form: 'short'})`    | `A$2.00`                         | `$2.00`                         |
| `i18n.formatCurrency(2, {currency: 'AUD', form: 'explicit'})` | `A$2.00 AUD`                     | `$2.00 AUD`                     |
| `i18n.formatCurrency(2, {currency: 'AUD', form: 'auto'})`     | `A$2.00 AUD`                     | `$2.00 AUD`                     |
| `i18n.formatCurrency(2, {currency: 'SGD', form: 'explicit'})` | `SGD 2.00 SGD`                   | `$2.00 SGD`                     |
| `i18n.getCurrencySymbol('AUD')`                               | `{symbol: 'A$', prefixed: true}` | `{symbol: '$', prefixed: true}` |

Deprecate usage of`i18n.getCurrencySymbolLocalized(locale, currency)`. Use `i18n.getCurrencySymbol(currency, locale)` instead.
