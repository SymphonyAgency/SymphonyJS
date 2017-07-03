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
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [['es2015', {modules: false}]],
                        plugins: [
                            'syntax-async-functions',
                            'syntax-dynamic-import',
                            'transform-async-to-generator',
                            'transform-regenerator',
                            'transform-runtime'
                        ]
                    }
                }]
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve('./'),
            path.resolve('./node_modules'),
        ]
    },
    plugins: [
    ],
};