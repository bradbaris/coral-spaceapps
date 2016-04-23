var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.resolve('./src/index.js'),
  dist: path.join(__dirname, 'dist')
}

module.exports = {
  entry: PATHS.app,
  output: {
    path: PATHS.dist,
    filename: 'bundle.js'
  },
  devtool: 'eval',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new OpenBrowserPlugin({url: 'http://localhost:8080/index.html'})
  ]
}
