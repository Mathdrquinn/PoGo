var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require("path");

const SRC = path.join(__dirname, 'src');
const APP = path.join(__dirname, 'app', 'js');


module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: path.join(SRC, 'jsx', 'index.jsx'),
    module: {
        loaders: [
            { test: /\.json/, loaders: ['json'] },
            {
                test: /\.jsx?$/,
                include: SRC,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            },
        ],
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    output: {
        path: APP,
        filename: 'app/bundle.min.js'
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};