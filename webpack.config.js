const webpack = require('webpack');
const path = require('path');

const config = {
  entry: path.join(__dirname, './dist/index.ts'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './'),
  },
  module: {
    loaders: [{
      test: /\.ts/,
      loaders: 'ts-loader',
      exclude: /node_modules/
    }]
  }
}

module.exports = config;