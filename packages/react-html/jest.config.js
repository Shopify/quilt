const baseConfig = require('../../jest-base-config');

module.exports = {
  ...baseConfig,
  displayName: __dirname.split('/').pop(),
};
