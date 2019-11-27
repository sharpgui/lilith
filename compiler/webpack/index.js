const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const prodConfig = require('./webpack.prod.config')
const compileDev = require('../build/build.dev')
const compileProd = require('../build/build.prod')
const getHtmlPlugin = require('./utils/htmlPlugins')

module.exports = {
  baseConfig,
  devConfig,
  prodConfig,
  compileDev,
  compileProd,
  getHtmlPlugin
}
