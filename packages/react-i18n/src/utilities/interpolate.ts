/**
 * Used to interpolate a string with values from an object.
 * `{key}` will be replaced with `replacements[key]`.
 */
export const DEFAULT_INTERPOLATION = /({([^}]*)})/g;

/**
 * Similar to Shopify themes' locale files.
 * `{{key}}` will be replaced with `replacements[key]`.
 */
export const MUSTACHE_INTERPOLATION = /({{[\s]*([\S]+?)[\s]*}})/g;

/**
 * Similar to Ruby ERB templating system.
 * `<%= key %>` will be replaced with `replacements[key]`.
 */
export const ERB_INTERPOLATION = /(<%=[\s]*([\S]+?)[\s]*%>)/g;
