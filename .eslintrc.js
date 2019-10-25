module.exports = {
  extends: [
    'plugin:shopify/typescript',
    'plugin:shopify/typescript-type-checking',
    'plugin:shopify/react',
    'plugin:shopify/jest',
    'plugin:shopify/prettier',
  ],
  parserOptions: {
    project: 'tsconfig.json',
  },
  rules: {
    // These rules should be enabled
    // but requires a lot of code modifications
    // to suppress the number of violations
    "shopify/jest/no-snapshots": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/no-misused-promises": "off"
  }
}
