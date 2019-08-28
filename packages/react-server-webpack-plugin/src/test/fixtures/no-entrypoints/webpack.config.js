const path = require('path');
const {ReactServerPlugin} = require('../../../react-server-webpack-plugin');

module.exports = function config(usesNode) {
  const universal = {
    mode: 'production',
    optimization: {
      minimize: false,
    },
    plugins: [new ReactServerPlugin()],
    resolve: {
      modules: ['node_modules', path.resolve(__dirname)],
    },
  };

  const server = {
    ...universal,
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
  };

  const client = {
    ...universal,
    name: 'client',
    target: 'web',
    entry: './client',
  };

  return [server, client];
};
