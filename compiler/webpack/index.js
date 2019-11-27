const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const prodConfig = require('./webpack.prod.config')
const compileDev = require('../build/build.dev')
const compileProd = require('../build/build.prod')

module.exports = {
  baseConfig,
  devConfig,
  prodConfig,
  compileDev,
  compileProd
}
