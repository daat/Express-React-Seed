var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
      main: [
        'webpack-hot-middleware/client',
        './src/index.js'
      ],
      vendor: [
        'moment',
        'whatwg-fetch',
        'underscore'
      ]
  },
  output: {
      filename: '[hash].[name].js',
      path: path.join(__dirname, 'public/dist'),
      publicPath: '/dist/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'] // Specify the common bundle's name.
    })
  ],
  module: {
    loaders: [{
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test:  /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css!postcss'
      },
      {
        test:  /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-loader?pngScale=2'
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};
