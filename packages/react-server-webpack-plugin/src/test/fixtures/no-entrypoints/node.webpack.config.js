const {serverConfig, clientConfig} = require('../webpack-utilities');

const {ReactServerPlugin} = require('../../../react-server-webpack-plugin');

const universal = {
  plugins: [
    new ReactServerPlugin({
      rails: false,
    }),
  ],
};

module.exports = [serverConfig(universal), clientConfig(universal)];
