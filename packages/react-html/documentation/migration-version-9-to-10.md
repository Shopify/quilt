# Migrating from `@shopify/react-html@9.x` to `@shopify/react-html@10.x`

Version 10.x of `@shopify/react-html` moved some components.

## `Style` is now `Stylesheet`

This component has been moved to `@shopify/react-html/server` and renamed to `<Stylesheet/>`.

```diff
-import {Style} from '@shopify/react-html';
+import {Stylesheet} from '@shopify/react-html/server';
```

## `Script`

This component has been moved to `@shopify/react-html/server`.

```diff
-import {Script} from '@shopify/react-html';
+import {Script} from '@shopify/react-html/server';
```
