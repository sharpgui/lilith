const path = require('path')
const fs = require('fs-extra')
const updateNotifier = require('update-notifier')
const shell = require('shelljs')
const logger = require('../../lib/logger')
const config = require('../../config')

function compiler(mode, source) {
  logger.info(`当前工作目录: ${process.cwd()}`)
  let compilerSource = source
  try {
    logger.info('source', source)
    compilerSource = config.compiler[source] || source
  } catch (error) {} // eslint-disable-line

  let compileFunction = () => {}
  let currentSource = compilerSource
  let compileFuncitonPath = `./node_modules/${currentSource}/build/build.${mode}.js`

  logger.info(path.join(config.context, 'node_modules', currentSource))

  // const notifier = updateNotifier({ pkg ,updateCheckInterval: 0})
  try {
    const pkg = require(path.resolve(
      `./node_modules/${currentSource}/package.json`
    ))
    const notifier = updateNotifier({ pkg })
    notifier.update && shell.exec(`yarn add ${compilerSource} -D`)
  } catch (error) {
    logger.info(`yarn add ${compilerSource} -D`)
    shell.exec(`yarn  add ${compilerSource} -D`)
  }
  logger.info('load compileFunciton from', path.resolve(compileFuncitonPath))
  compileFunction = require(path.resolve(compileFuncitonPath))
  const webpackSettings = config.webpack || {}
  logger.debug(webpackSettings)
  compileFunction(webpackSettings)
}

module.exports = compiler
