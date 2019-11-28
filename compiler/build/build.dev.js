const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackDevConfig = require('../webpack/webpack.dev.config.js')
const merge = require('webpack-merge')
const { join } = require('path')
const template = require('art-template')
const fs = require('fs-extra')
const chokidar = require('chokidar')

const copyFileContent = function(from, to) {
  const str = template(from)
  fs.outputFileSync(to, str.sourcesContent)
}

// 监听文件变化，并将更改后的内容注入到_temp目录中
const fileWatcher = chokidar.watch(`${process.cwd()}/src`)

module.exports = function(webpackSettings = {}) {
  const compiler = webpack(merge(webpackDevConfig, webpackSettings))
  fileWatcher.on('all', function(event, path) {
    const pathArr = path.split('/')
    const len = pathArr.length
    const filename = pathArr[len - 1]
    // 如果是添加文件，则将该文件进行一次编译处理之后拷贝到目标目录
    let from = ''
    let to = ''
    switch (event) {
      case 'change':
      case 'add': {
        // TODO 编译
        from = path
        to = join(path, '../..', '_temp', filename)
        break
      }
      case 'unlink': {
        return fs.removeSync(join(path, '../..', '_temp', filename))
      }
    }
  
    event !== 'addDir' && copyFileContent(from, to)
  })
  const server = new WebpackDevServer(compiler, {
    stats: {
      chunks: false, // 使构建过程更静默无输出
      colors: true, // 在控制台展示颜色,
      assets: false,
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
      poll: 1000,
    },
    writeToDisk: true
  })

  server.listen(8080)
}
