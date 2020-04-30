const path = require('path')
const fs = require('fs-extra')
const { blue, red, green } = require('../lib/color')
const isDebug = process.env.NODE_ENV === 'dev'

function loggerFactory() {
  // 输出到控制台
  const debugLogger = console

  return {
    debug(...rest) {
      isDebug && debugLogger.debug(blue('DEBUG'), ...rest.map(m => blue(m)))
    },
    info(...rest) {
      debugLogger.info(green('INFO'), ...rest.map(m => green(m)))
    },
    error(...rest) {
      // 输出到文件和控制台 本以为在error的时候在调用可以做到只有，error 是才生产log，不过没成。
      // const logger = log4js.getLogger('info')
      debugLogger.error(red('ERROR'), ...rest.map(m => red(m)))
      fs.appendFileSync(path.join('lilith.log'), rest.join('\n'))
      // logger.error(...rest)
    }
  }
}

module.exports = loggerFactory()
