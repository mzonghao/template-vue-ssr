/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import autoprefixer from 'autoprefixer';
import configBase from './config.base';

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  output: {
    path: path.resolve(__dirname, `..${configBase.buildDir}`),
    publicPath: `${configBase.buildDir}/`,
    filename: '[name].[chunkhash].js'
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: !isDev,
          preserveWhitespace: false
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: isDev
          ? 'vue-style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader'
          : ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader?minimize&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  plugins: [
                    autoprefixer({
                      browsers: ['iOS > 9', 'Android > 4']
                    })
                  ]
                }
              },
              'less-loader'
            ]
          })
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2)(\?|$)/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.(ico)$/,
        loader: 'file-loader?name=assets/[name].[ext]'
      },
      {
        test: /\.(mp4|mov)$/,
        loader: 'file-loader?name=assets/[name].[ext]'
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: isDev ? [
          'vue-style-loader',
          'css-loader'
        ] : ExtractTextPlugin.extract({
          use: 'css-loader?minimize',
          fallback: 'vue-style-loader'
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      public: path.resolve(__dirname, '../public'),
      core: path.resolve(__dirname, '../src/core'),
      components: path.resolve(__dirname, '../src/components')
    }
  },
  plugins: isDev ? [
    new FriendlyErrorsPlugin()
  ] : [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    })
  ],
  devtool: isDev ? '#cheap-module-source-map' : false,
  performance: {
    maxEntrypointSize: 300000,
    hints: isDev ? false : 'warning'
  }
};
