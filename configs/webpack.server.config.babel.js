/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin';
import baseConfig from './webpack.base.config';

const env = process.env.NODE_ENV;

const serverConfig = merge(baseConfig, {
  target: 'node',
  devtool: '#source-map',
  entry: './src/server-entry.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.VUE_ENV': JSON.stringify('server')
    }),
    new VueSSRServerPlugin()
  ]
});

module.exports = serverConfig;
