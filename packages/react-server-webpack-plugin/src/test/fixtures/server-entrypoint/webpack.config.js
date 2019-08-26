const {serverConfig, clientConfig} = require('../webpack-utilities');

module.exports = [serverConfig(), clientConfig()];
