const isDev = process.env.NODE_ENV !== 'production';
const path = require('path');
const filename = isDev ? 'index' : 'index-[hash]';

const ManifestPlugin = require('webpack-manifest-plugin');

class IgnoreNotFoundExportPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('warnfix-plugin', (stats) => {
      const messageRegExp = /export .* was not found in/;
      stats.compilation.warnings = stats.compilation.warnings.filter((warn) => {
        return !(warn.name === 'ModuleDependencyWarning' && messageRegExp.test(warn.message));
      });
    });
  }
}

module.exports = {
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.entry = './src/index.ts';
    config.output.filename = `${filename}.js`;
    config.output.path = path.resolve(__dirname, './dist');

    config.plugins.unshift(new IgnoreNotFoundExportPlugin());
    config.plugins.push(new ManifestPlugin());
  },
};