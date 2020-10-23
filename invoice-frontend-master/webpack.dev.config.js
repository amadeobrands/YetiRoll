const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const baseConfig = require('./webpack.base.config');

const devConfig = merge(baseConfig, {
    mode: 'development',
    entry: [
        `${baseConfig.externals.paths.src}/index.tsx`,
    ],
    output: {
        path: `${baseConfig.externals.paths.build}`,
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/',
    },
    devtool: 'cheap-eval-source-map',
    optimization: {
        namedModules: true,
        namedChunks: true,
        splitChunks: {
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 2,
                    priority: -10
                }
            }
        },
        runtimeChunk: 'single'
    },
    stats: {
        children: false,
        entrypoints: false
    },
    target: "web",
    watch: true,
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        overlay: {
            warnings: true,
            errors: true,
        },
        historyApiFallback: true,
        contentBase: baseConfig.externals.paths.src,
        watchContentBase: true,
        disableHostCheck: true,
        stats: {
            modules: false,
            warnings: true,
            chunks: false,
            publicPath: false,
            hash: false,
            version: false,
            timings: true,
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html',
        }),
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
        }),
        new webpack.WatchIgnorePlugin([
            /node_modules/
        ])
    ],
});

module.exports = new Promise((resolve) => resolve(devConfig));
