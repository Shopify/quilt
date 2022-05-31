/**
 * Used to interpolate a string with values from an object.
 * `{key}` will be replaced with `replacements[key]`.
 */
export const DEFAULT_FORMAT = /{\s*(\w+)\s*}/g;

/**
 * Similar to Shopify themes' locale files.
 * `{{key}}` will be replaced with `replacements[key]`.
 */
export const MUSTACHE_FORMAT = /{{\s*(\w+)\s*}}/g;

/**
 * Similar to Ruby ERB templating system.
 * `<%= key %>` will be replaced with `replacements[key]`.
 */
export const ERB_FORMAT = /<%=\s+(\w+)\s+%>/g;
