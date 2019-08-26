const {serverConfig, clientConfig} = require('../webpack-utilities');

const {ReactServerPlugin} = require('../../../react-server-webpack-plugin');

const universal = {
  plugins: [
    new ReactServerPlugin({
      port: 3000,
      host: '127.0.0.1',
      assetPrefix: 'https://localhost/webpack/assets',
    }),
  ],
};

module.exports = [serverConfig(universal), clientConfig(universal)];
