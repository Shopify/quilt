const {ReactServerPlugin} = require('../../../react-server-webpack-plugin');

const universal = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  plugins: [new ReactServerPlugin()],
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

module.exports = [server, client];
