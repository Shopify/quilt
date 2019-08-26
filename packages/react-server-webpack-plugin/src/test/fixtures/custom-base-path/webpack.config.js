const {ReactServerPlugin} = require('../../../react-server-webpack-plugin');
const {serverConfig, clientConfig} = require('../webpack-utilities');

const universal = {
  plugins: [new ReactServerPlugin({basePath: './app/ui'})],
};

module.exports = [
  serverConfig(universal, {
    entry: './app/ui/server',
  }),
  clientConfig(universal, {
    entry: './app/ui/client',
  }),
];
