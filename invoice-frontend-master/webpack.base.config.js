const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const paths = {
    src: path.join(process.cwd(), 'src'),
    build: path.join(process.cwd(), 'dist'),
};

module.exports = {
    externals: {
        paths,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'cache-loader',
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            transpileOnly: true,
                        }
                    }
                ],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    'cache-loader',
                    'thread-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            transpileOnly: true,
                        },
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                loader: 'file-loader',
                options: {
                    name: "[name].[ext]?[hash]",
                    outputPath: "assets/",
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10 * 1024,
                            noquotes: true,
                        },
                    },
                ],
            },
        ]
    },
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.react.js'],
        mainFields: ['browser', 'jsnext:main', 'main'],
        alias: {
            "@app": path.resolve(paths.src, ''),
        }
    },
    plugins: [
        new Dotenv(),
        new HardSourceWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            // tslint: false,
            // useTypescriptIncrementalApi: true,
            // checkSyntacticErrors: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
};
