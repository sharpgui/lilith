const log4js = require('log4js')
const path = require('path')
const { blue, red, green } = require('chalk')
const isDebug = process.env.NODE_ENV === 'dev'
log4js.configure({
  appenders: {
    lilith: {
      type: 'file',
      layout: {
        type: 'pattern',
        pattern: '%d{[yyyy-dd hh:mm]} %p lilith %m'
      },
      filename: path.join(process.cwd(), 'lilith.log')
    },
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{[yyyy-dd hh:mm]} %m'
      }
    }
  },
  categories: {
    default: { appenders: ['console'], level: 'debug' },
    info: { appenders: ['lilith'], level: 'info' }
  },
  pm2: true
})

function loggerFactory() {
  // 输出到控制台
  const debugLogger = log4js.getLogger()
  // 输出到文件和控制台
  const logger = log4js.getLogger('info')

  return {
    debug(...rest) {
      isDebug && debugLogger.debug(blue('DEBUG'), ...rest.map(m => blue(m)))
    },
    info(...rest) {
      debugLogger.info(green('INFO'), ...rest.map(m => green(m)))
      // logger.info(...rest)
    },
    error(...rest) {
      debugLogger.error(red('ERROR'), ...rest.map(m => red(m)))
      logger.error(...rest)
    }
  }
}

module.exports = loggerFactory()
