module.exports = {
    overrides: [
      {
        files: [
            './test/fixtures/**/*.*',
        ],
        rules: {
            '@shopify/typescript/prefer-pascal-case-enums': 'off',
            'babel/object-curly-spacing': 'off',
            'prettier/prettier': 'off',
            'import/newline-after-import': 'off',
        },
      },
    ],
  };
