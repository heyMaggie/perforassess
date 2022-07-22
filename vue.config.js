'use strict';
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.alias.set('@', resolve('src'));
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.2.204:20080',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
};
