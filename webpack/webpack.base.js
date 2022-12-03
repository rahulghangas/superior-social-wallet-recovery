/**
 * Common webpack configuration
 */

 const path = require('path')
 const webpack = require('webpack')
 const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
 
 module.exports = (options) => ({
   mode: options.mode,
   entry: options.entry,
   output: {
     path: path.resolve(process.cwd(), 'dist'),
     publicPath: '/',
     ...options.output,
   },
   optimization: options.optimization,
   module: {
     rules: [
       {
         test: /\.ts(x)?$/,
         exclude: /node_modules/,
         use: [
           {
             loader: 'ts-loader',
             options: {
               transpileOnly: true,
             },
           },
         ],
       },
       {
          test: /\.css$/i,
          use: ["style-loader", 'css-loader'],
        },
       {
         test: /\.(jpg|png|gif)$/,
         type: 'asset/resource',
         use: [
           {
             loader: 'image-webpack-loader',
             options: {
               mozjpeg: {
                 progressive: true,
               },
               gifsicle: {
                 interlaced: false,
               },
               optipng: {
                 optimizationLevel: 7,
               },
               pngquant: {
                 quality: '65-90',
                 speed: 4,
               },
               webp: {
                 quality: 75,
               },
             },
           },
         ],
       },
     ],
   },
   plugins: options.plugins.concat([
     new ForkTsCheckerWebpackPlugin(),
     new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
     }),
     new webpack.ProvidePlugin({
      process: 'process/browser',
     }),
   ]),
   resolve: {
     // Define your folder resolve path used in import or require
     modules: ['node_modules', 'src'],
     extensions: ['.ts', '.tsx', '.js', '.jsx'],
     fallback: {
      buffer: false,
      crypto: false,
      events: false,
      path: false,
      stream: false,
      string_decoder: false,
     }
   },
   devtool: options.devtool,
   target: 'web', // Make web variables accessible to webpack, e.g. window
   performance: options.performance || {},
 
   // webpack-dev-server configuration
   devServer: {
     historyApiFallback: true,
     hot: true,
   },
 })
 