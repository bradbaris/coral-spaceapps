var webpack = require('webpack');
var path = require('path');

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
  }
}
