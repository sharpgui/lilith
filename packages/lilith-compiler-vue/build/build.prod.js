const webpack = require('webpack')
const webpackProdConfig = require('../webpack/webpack.prod.config.js')
const merge = require('webpack-merge')

module.exports = function(webpackSettings) {
  const compiler = webpack(merge(webpackProdConfig, webpackSettings))
  compiler.run((err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
          assets: false,
        })
      )
    }
  )
}