const path = require('path')
const logger = require('./logger')
const config = require('../config')

function compiler(mode, source) {
  logger.info(`当前工作目录: ${process.cwd()}`)
  let compilerSource = source
  try {
    compilerSource = config.compiler[source]
  } catch (error) {} // eslint-disable-line

  let compileFunction = () => {}
  const currentSource =
    process.env.NODE_ENV === 'dev' ? '../../lilith-compiler' : compilerSource
  const compileFuncitonPath = `${currentSource}/build/build.${mode}.js`

  logger.info('load compileFunciton from', compileFuncitonPath)
  compileFunction = require(compileFuncitonPath)

  try {
    // const webpackSettings = require(path.resolve(
    //   `${config.context}/webpack.config.js`
    // ))
    // logger.info(
    //   '读取本地配置',
    //   path.resolve(`${config.context}/webpack.config.js`)
    // )
    const webpackSettings = config.webpack || {}
    logger.info('从当前目录的 lilith.config.js 中读取webpack配置')
    compileFunction(webpackSettings)
  } catch (err) {
    compileFunction()
  }
}

module.exports = compiler
