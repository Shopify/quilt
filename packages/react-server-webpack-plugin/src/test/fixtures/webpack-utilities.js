const {ReactServerPlugin} = require('../../react-server-webpack-plugin');

const universalConfig = function(config) {
  return {
    mode: 'production',
    optimization: {
      minimize: false,
    },
    plugins: [new ReactServerPlugin()],
    ...config,
  };
};

const clientConfig = function(customUniversal, customClient) {
  return {
    ...universalConfig(customUniversal),
    name: 'client',
    target: 'web',
    entry: './client',
    ...customClient,
  };
};

const serverConfig = function(customUniversal, customServer) {
  return {
    ...universalConfig(customUniversal),
    name: 'server',
    target: 'node',
    entry: './server',
    externals: [
      (context, request, callback) => {
        if (/node_modules/.test(context)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      },
    ],
    ...customServer,
  };
};

module.exports = {
  universalConfig,
  clientConfig,
  serverConfig,
};
