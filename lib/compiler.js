const path = require('path')
const logger = require('./logger')
const config = require('../config')

function compiler(mode, source) {
  logger.info(`当前工作目录: ${process.cwd()}`)
  let compileFunction = () => {}
  const currentSource =
    process.env.NODE_ENV === 'dev' ? '../../lilith-compiler' : source
  const compileFuncitonPath = `${currentSource}/build/build.${mode}.js`

  logger.info('load compileFunciton from', compileFuncitonPath)
  compileFunction = require(compileFuncitonPath)

  try {
    const webpackSettings = require(path.resolve(
      `${config.context}/webpack.config.js`
    ))
    logger.info(
      '读取本地配置',
      path.resolve(`${config.context}/webpack.config.js`)
    )
    compileFunction(webpackSettings)
  } catch (err) {
    compileFunction()
  }
}

module.exports = compiler
