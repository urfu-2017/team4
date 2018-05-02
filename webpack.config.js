'use strict';
require('dotenv').config();

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase();
const mode = NODE_ENV === 'production' || NODE_ENV === 'development' ? NODE_ENV : 'none';
const isDevelopment = mode === 'development';

const clientSrcPath = path.resolve(__dirname, 'client');
const clientBuildPath = path.resolve(__dirname, 'build/server/static');

module.exports = {
    mode: mode,
    entry: path.resolve(clientSrcPath, 'index.tsx'),
    output: {
        filename: 'bundle.js',
        path: clientBuildPath
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        modules: ['node_modules', clientSrcPath]
    },

    module: {
        rules: [{
            oneOf: [
                {
                    test: /\.[jt]sx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: { configFile: path.resolve(clientSrcPath, 'tsconfig.json') }
                    },
                    exclude: /node_modules/
                },

                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: {
                            loader: 'style-loader',
                            options: { hmr: isDevelopment }
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    minimize: !isDevelopment
                                }
                            },
                            { loader: 'postcss-loader' }
                        ]
                    })
                },

                {
                    loader: 'file-loader',
                    exclude: [/\.js$/, /\.html$/, /\.json$/],
                    options: { name: 'media/[name].[hash:8].[ext]' }
                }
            ]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(clientSrcPath, 'index.html'),
            minify: isDevelopment && {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new ExtractTextPlugin({ filename: 'bundle.css', disable: isDevelopment })
    ],

    devServer: {
        hot: true,
        inline: true,
        compress: true,
        watchContentBase: true,
        historyApiFallback: true,
        clientLogLevel: 'none',
        contentBase: clientSrcPath,
        host: '0.0.0.0',
        publicPath: '/',
        watchOptions: { ignored: /node_modules/ },
        port: process.env.PORT ? Number(process.env.PORT) : 3000
    },

    devtool: isDevelopment ? 'cheap-module-eval-source-map' : 'source-map'
};
