const path = require('path')
const fs = require('fs-extra')
const execSync = require('child_process').execSync
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
  const compileFuncitonPath = `./node_modules/${currentSource}/build/build.${mode}.js`

  logger.info(path.join(config.context, 'node_modules', currentSource))
  // 判断对应的compiler是否已经安装，没有安装则安装
  if (
    !fs.existsSync(path.join(config.context, 'node_modules', currentSource))
  ) {
    logger.info(`yarn add ${currentSource} -D`)
    execSync(`yarn add ${currentSource} -D`)
  }
  logger.info('load compileFunciton from', path.resolve(compileFuncitonPath))

  compileFunction = require(path.resolve(compileFuncitonPath))

  try {
    const webpackSettings = config.webpack || {}
    logger.info('从当前目录的 lilith.config.js 中读取webpack配置')
    compileFunction(webpackSettings)
  } catch (err) {
    compileFunction()
  }
}

module.exports = compiler
