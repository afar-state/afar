const nxPreset = require('@nrwl/jest/preset').default;

const esModules = ['nanoid'].join('|');

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`]
};
