const webpack = require('webpack');
const path = require('path');

const config = {
  entry: path.join(__dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './lib'),
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: {
    md5: 'md5',
    url: 'url',
    request: 'request',
    xml2json: 'xml2json',
    js2xmlparser: 'js2xmlparser',
  },
  module: {
    loaders: [{
      test: /\.ts/,
      loaders: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  target: 'node'
}

module.exports = config;