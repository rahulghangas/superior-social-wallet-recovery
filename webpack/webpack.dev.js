/**
 * Development webpack configuration
 */

 const path = require('path')
 const HtmlWebpackPlugin = require('html-webpack-plugin')
 const CircularDependencyPlugin = require('circular-dependency-plugin')
 
 module.exports = require('./webpack.base')({
   mode: 'development',
   entry: [
     path.join(process.cwd(), 'src/index.tsx'), // Start with index.tsx
   ],
   output: {
     filename: '[name].js',
     chunkFilename: '[name].chunk.js',
   },
   optimization: {
     splitChunks: {
       chunks: 'all',
     },
   },
   plugins: [
     new HtmlWebpackPlugin({
       template: 'public/index.html',
       cache: true,
       hash: true,
       base: '/',
     }),
     new CircularDependencyPlugin({
       exclude: /a\.js|node_modules/, // exclude node_modules
       failOnError: true,
     }),
   ],
 
   // Emit a source map for easier debugging
   // See https://webpack.js.org/configuration/devtool/#devtool
   devtool: 'source-map',
   performance: {
     hints: 'warning',
   },
 })
 