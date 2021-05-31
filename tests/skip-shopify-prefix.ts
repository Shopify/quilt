const PACKAGES_WITHOUT_SHOPIFY_PREFIX = [
  'graphql-config-utilities',
  'graphql-fixtures',
  'graphql-mini-transforms',
  'graphql-tool-utilities',
  'graphql-typed',
  'graphql-typescript-definitions',
  'graphql-validate-fixtures',
];

export function shouldSkipShopifyPrefix(packageName: string) {
  const skipPrefix = PACKAGES_WITHOUT_SHOPIFY_PREFIX.find(
    (noPrefixPacakge) => packageName === noPrefixPacakge,
  );

  return Boolean(skipPrefix);
}
