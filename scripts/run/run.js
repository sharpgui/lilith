const path = require('path')
const fs = require('fs-extra')
const updateNotifier = require('update-notifier')
const execSync = require('child_process').execSync
const logger = require('../../lib/logger')
const config = require('../../config')

function compiler(mode, source) {
  logger.info(`当前工作目录: ${process.cwd()}`)
  let compilerSource = source
  try {
    if (config.compiler[source]) {
      compilerSource = config.compiler[source]
    }
  } catch (error) {} // eslint-disable-line

  let compileFunction = () => {}
  let currentSource = compilerSource
  let compileFuncitonPath = `./node_modules/${currentSource}/build/build.${mode}.js`

  logger.info(path.join(config.context, 'node_modules', currentSource))
  // 判断对应的compiler是否已经安装，没有安装则安装
  if (
    !fs.existsSync(path.resolve(config.context, 'node_modules', compilerSource))
  ) {
    logger.info(`yarn add ${compilerSource} -D`)
    execSync(`yarn add ${compilerSource} -D`)
  }
  logger.info('load compileFunciton from', path.resolve(compileFuncitonPath))
  const pkg = require(path.resolve(
    `./node_modules/${currentSource}/package.json`
  ))
  // const notifier = updateNotifier({ pkg ,updateCheckInterval: 0})
  const notifier = updateNotifier({ pkg })

  notifier.notify()

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
