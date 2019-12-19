const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babelLilith = require('../babel.lilith')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { join } = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.scss',
      '.sass',
      '.less',
      '.css'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          // 'cache-loader',
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer(), cssnano({ preset: 'default' })]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded'
            }
          }
        ]
      },
      {
        test: /\.(less)$/,
        use: [
          // 'cache-loader',
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer(), cssnano({ preset: 'default' })]
            }
          },
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: babelLilith
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, '..', '/public/views/index.html'),
      favicon: join(__dirname, '..', '/public/icon/favicon.ico')
    }),
    new VueLoaderPlugin(),
  ],
  performance: {
    hints: false
  }
}
