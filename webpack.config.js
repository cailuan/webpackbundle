const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack =require('webpack')
const FileManagerPlugin = require('filemanager-webpack-plugin');
// const babelLoader = require('./loader/babel-loader')

module.exports = {
  context: process.cwd(),
  entry: './src/index.js',
  mode:'development',
  devtool: 'hidden-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   append: '\n//# sourceMappingURL=http://127.0.0.1:8080/sourcemap/[url]',
    //   filename: '[name].map',
    // }),
    new FileManagerPlugin({
      events:{
        onEnd:{
          copy:[{
            source:"dist/**/*.map",
            destination:"/Users/cailuan/Project/webpack-import/sourcemap"
          }],
          delete:["dist/**/*.map"]
        }
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
                {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            ]
      }
    ]
  }

};