const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DonePlugin = require('./plugin/DonePlugin')
const babelLoader = require('./loader/babel-loader')

module.exports = {
  context: process.cwd(),
  entry: './src/index.js',
  mode:'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  
  },
  plugins: [
    new DonePlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{loader: "babelLoader", options: {

          }}]
      }
    ]
  }

};