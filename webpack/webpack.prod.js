/**
 * Production webpack configuration
 */

 const path = require('path')
 const HtmlWebpackPlugin = require('html-webpack-plugin')
 const webpack = require('webpack')
 const TerserPlugin = require('terser-webpack-plugin')
 const CopyPlugin = require('copy-webpack-plugin')
 
 module.exports = require('./webpack.base')({
   mode: 'production',
   entry: [path.join(process.cwd(), 'src/index.tsx')],
   output: {
     filename: '[name].[chunkhash].js',
     chunkFilename: '[name].[chunkhash].chunk.js',
   },
   optimization: {
     chunkIds: 'size',
     minimize: true,
     mangleExports: 'size',
     mangleWasmImports: true,
     moduleIds: 'size',
     minimizer: [
       new TerserPlugin({
         extractComments: false,
         terserOptions: {
           warnings: false,
           compress: {
             comparisons: false,
           },
           parse: {},
           mangle: true,
           output: {
             comments: false,
             ascii_only: true,
           },
         },
         parallel: true,
       }),
     ],
     sideEffects: true,
     concatenateModules: true,
     runtimeChunk: 'single',
     splitChunks: {
       chunks: 'all',
       maxInitialRequests: 10,
       minSize: 0,
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name(module) {
             const packageName = module.context.match(
               /[\\/]node_modules[\\/](.*?)([\\/]|$)/
             )[1]
             return `npm.${packageName.replace('@', '')}`
           },
         },
       },
     },
   },
   babelQuery: {
     plugins: ['lodash'],
     presets: [
       ['@babel/preset-env', { modules: false, targets: { node: 'current' } }],
     ],
   },
   plugins: [
     // Minify and optimize the index.html
     new HtmlWebpackPlugin({
       template: 'public/index.html',
       cache: true,
       hash: true,
       base: '/',
       templateParameters: {
         gMapApiKey: process.env.GMAP_API_KEY,
         marketplaceURL: process.env.MARKETPLACE_URL,
         gtag: process.env.GTAG,
       },
       minify: {
         removeComments: true,
         collapseWhitespace: true,
         removeRedundantAttributes: true,
         useShortDoctype: true,
         removeEmptyAttributes: true,
         removeStyleLinkTypeAttributes: true,
         keepClosingSlash: true,
         minifyJS: true,
         minifyCSS: true,
         minifyURLs: true,
       },
     }),
     new webpack.ids.HashedModuleIdsPlugin({
       hashFunction: 'sha256',
       hashDigest: 'hex',
       hashDigestLength: 20,
     }),
     new CopyPlugin({
       patterns: [
         { from: 'public/assets', to: 'assets' },
       ],
     }),
   ],
   performance: {
     assetFilter: (assetFilename) =>
       !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
   },
 })
 