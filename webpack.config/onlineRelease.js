const path = require('path');
const mainConfig = require('./webpack.config.js');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')

/**
 * 给打包的主/分支文件加上版本号
 */
const Version = (+new Date);

var devConfig = {
    mode: 'production',
    output: {
        /**
         * 配置主文件的文件名，加上版本号
         */
        filename: '[name].Li.' + Version + '.js',
        /**
         * 配置异步请求的文件名，也就是分支文件名，并加上版本号
         */
        chunkFilename: '[id].Li.' + Version + '.js',
        path: path.resolve(__dirname, '../onlineRelease')
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                uglifyOptions: {
                    compress: {
                        drop_debugger: true,
                        drop_console: true
                    },
                    mangle: true,
                    warnings: false,
                },
            }),
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            /**
             * 这里定义的环境变量可以直接在业务代码里拿到，
             * 属于是webpack直接打印上去的，
             * 并不是写在业务代码逻辑里的。
             */
            'SYS_MODE': JSON.stringify("rel")
        }),
    ]
}

module.exports = merge.merge(mainConfig, devConfig);