var path = require('path');

var terser = require('@rollup/plugin-terser');

module.exports = function (config) {

  config.plugins.push(terser());
  config.output.sourcemap = true;

  return config;
};
