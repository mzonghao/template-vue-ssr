/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import merge from 'webpack-merge';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';
import configBase from './config.base';
import baseConfig from './webpack.base.config';

const env = process.env.NODE_ENV;
const isDev = process.env.NODE_ENV === 'development';
const { cdn } = configBase;

let rules = [];

if (isDev) {
  rules = [
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    },
    {
      enforce: 'pre',
      test: /\.vue$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }
  ];
}

const clientConfig = merge(baseConfig, {
  module: {
    rules
  },
  entry: {
    app: './src/client-entry.js'
  },
  output: {
    publicPath: !isDev && cdn ? cdn : `${configBase.buildDir}/`
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.VUE_ENV': JSON.stringify('client')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
        /node_modules/.test(module.context) && !/\.css$/.test(module.request)
      )
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin()
  ]
});

module.exports = clientConfig;
