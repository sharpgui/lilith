const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const babelConfig = require('../babel.lilith.js')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src',
  output: {
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: [
      '.vue',
      '.js',
      '.ts',
      '.jsx',
      '.scss',
      '.sass',
      '.less',
      '.css'
    ]
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: babelConfig,
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: isProd
    ? [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '..', '/public/views/index.html'),
        favicon: path.join(__dirname, '..', '/public/icon/favicon.ico')
      }),
      new VueLoaderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
    : [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '..', '/public/views/index.html'),
        favicon: path.join(__dirname, '..', '/public/icon/favicon.ico')
      }),
      new VueLoaderPlugin()
    ]
}
