const webpack = require('webpack')
const path = require('path');


module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: __dirname + '/dist/',
        filename: '[name].js',
        chunkFilename: '[name]-chunk.js',
        libraryTarget: "umd",
        library: "symphonyjs",
        umdNamedDefine: true
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     exclude: /(node_modules)/,
            //     // use: [{
            //     //     loader: 'babel-loader',
            //     //     options: {
            //     //         presets: [['es2015']],
            //     //         plugins: [
            //     //             'syntax-async-functions',
            //     //             'syntax-dynamic-import',
            //     //             'transform-async-to-generator',
            //     //             'transform-regenerator',
            //     //             'transform-runtime',
            //     //             "babel-plugin-add-module-exports"
            //     //         ]
            //     //     }
            //     // }]
            // }
        ]
    },
    resolve: {
        modules: [
            path.resolve('./'),
            path.resolve('./node_modules'),
        ]
    }
};