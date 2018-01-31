'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios');
const express = require('express');
const app = express();
const routers = require('./dev-server');

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app){
    	routers(app);
    	let cache = {};
    	app.get('/api/singers',function(req,res){
    		if(cache.discList){
    			res.json(getPage(req.query.page));
    			console.log('from cache')
    			return;
    		}
    		var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
    		axios.get(url, {
			    headers: {
			      referer: 'https://c.y.qq.com/',
			      host: 'c.y.qq.com'
			    },
			    params: {
			    	platform: 'yqq',
				    hostUin: 0,
				    sin: 0,
				    ein: 29,
				    sortId: 5,
				    needNewCode: 0,
				    categoryId: 10000000,
				    rnd: Math.random(),
				    format: 'json',
				      g_tk: 1928093487,
					  inCharset: 'utf-8',
					  outCharset: 'utf-8',
					  notice: 0
			    }
			  }).then((response) => {
			  	console.log('from request')
			  	if(!cache.discList){
			  		cache.discList = response.data.data.list;
			  	}
			    res.json(getPage(req.query.page));
			  }).catch((e) => {
			    console.log(e)
			  })
			  function getPage(current){
			  	return cache.discList.slice((current-1)*10,current*10-1);
			  }
			  
    	})
    }
    
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
