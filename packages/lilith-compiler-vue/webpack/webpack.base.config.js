const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babelLilith = require('../babel.lilith')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { join } = require('path')

module.exports = {
  entry: './src',
  output: {
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass', '.less', '.css']
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
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
    new VueLoaderPlugin()
  ],
  performance: {
    hints: false
  }
}
