const path = require('path');
const mainConfig = require('./webpack.config.js');
const merge = require('webpack-merge');
const webpack = require('webpack');


var devConfig = {
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../buildSrc')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './bildSrc',
        open: true,
        port: 9000,
        hot: true,
        host: "0.0.0.0"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            /**
             * 这里定义的环境变量可以直接在业务代码里拿到，
             * 属于是webpack直接打印上去的，
             * 并不是写在业务代码逻辑里的。
             */
            'SYS_MODE': JSON.stringify("dev")
        }),
    ]
}

module.exports = merge.merge(mainConfig, devConfig);