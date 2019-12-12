const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babelConfig = require('../babel.config')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')

module.exports = {
  entry: './src/',
  output: {
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
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
            options: babelConfig()
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: babelConfig()
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              allowTsInNodeModules: true,
              configFile: path.resolve(__dirname, '../tsconfig.json')
            }
          }
          // {
          //   loader: 'art-template-loader'
          // }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, '..', '/public/views/index.html'),
      favicon: join(__dirname, '..', '/public/icon/favicon.ico')
    })
  ],
  performance: {
    hints: false
  }
}
