const webpack = require('webpack');
const SourceMapPlugin = require('./sourceMapPlugin');
const webpackConfig = require('./webpack.base.config');
const _ = require('lodash');

_.forEach(webpackConfig, function(config) {
    // in debug use the debug build of redux
    config.resolve.alias.redux$ = 'redux/dist/redux.js';

    config.mode = 'none';

    config.cache = true;
    config.module.unsafeCache = true;
    config.optimization.namedModules = true;
    config.optimization.namedChunks = true;

    config.optimization.flagIncludedChunks = false;
    config.optimization.occurrenceOrder = false;
    config.optimization.usedExports = false;
    config.optimization.sideEffects = false;
    config.optimization.noEmitOnErrors = false;
    config.optimization.concatenateModules = false;
    config.optimization.minimize = false;

    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            BUILD_IS_DEBUG: true,
        }),
        new SourceMapPlugin({
            filename: '[file].map',
            append: `//# sourceMappingURL=${config.output.publicPath}[url]`,
        }),
    ]);
});

module.exports = webpackConfig;
