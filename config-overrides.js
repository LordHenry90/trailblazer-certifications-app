const { override, addWebpackAlias } = require('customize-cra');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    stream: 'stream-browserify'
  }),
  (config) => {
    config.plugins.push(new NodePolyfillPlugin());
    return config;
  }
);
