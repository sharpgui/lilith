const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackDevConfig = require('../webpack/webpack.dev.config.js')
const { createNewModule } = require('quickly-template/lib/createTemplate')
const merge = require('webpack-merge')
const { join } = require('path')
const fs = require('fs-extra')
const fileWatcher = require('../lib/fileWatcher')

module.exports = function(webpackSettings) {
  createNewModule({
    globPattern: 'src/*.tsx',
    target: '.lilith/src',
    renderOptions: { name: 'LilithTemplate' },
    name: ''
  })
  fs.copySync(join(__dirname, '../hook'), join(process.cwd(), './.lilith'))
  fileWatcher()
  const compiler = webpack(
    merge(webpackDevConfig, { entry: './.lilith/index' }, webpackSettings)
  )

  const server = new WebpackDevServer(compiler, {
    stats: {
      chunks: false, // 使构建过程更静默无输出
      colors: true, // 在控制台展示颜色,
      assets: false
    },
    contentBase: join(__dirname, 'dist'),
    historyApiFallback: true,
    clientLogLevel: 'info',
    publicPath: '/',
    hot: true,
    quiet: false,
    noInfo: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    overlay: true,
    // host: '0.0.0.0'
    useLocalIp: true
    // writeToDisk: true
  })

  server.listen(8080)
}
