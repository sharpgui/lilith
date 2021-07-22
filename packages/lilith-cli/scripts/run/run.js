const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const updateNotifier = require('update-notifier')
const shell = require('shelljs')
const logger = require('../../lib/logger')
const config = require('../../config')

function isMatch(cwd, pattern) {
  return glob.sync(path.join(cwd, '**', pattern)).length
}

function compiler(mode, entry) {
  // mode 等于 template 不支持自定义路径
  let currentEntry =
    mode === 'template' ? path.resolve('.lilith') : path.resolve(entry)

  let compilerSource = config['react']

  if (isMatch(currentEntry, '*.vue')) {
    compilerSource = config['vue']
  }

  logger.info(`当前工作目录: ${process.cwd()}`, compilerSource)

  let compileFunction = () => {}
  let compileFuncitonPath = `./node_modules/${compilerSource}/build/build.${mode}.js`
  logger.info(
    '编译源路径:',
    path.join(config.context, 'node_modules', compilerSource)
  )
  logger.info('入口文件:', compilerSource)

  // 检查更新逻辑
  try {
    const pkg = require(path.resolve(
      `./node_modules/${compilerSource}/package.json`
    ))
    const notifier = updateNotifier({ pkg })
    notifier.update && shell.exec(`yarn add ${compilerSource} -D`)
  } catch (error) {
    logger.info(`yarn add ${compilerSource} -D`)
    shell.exec(`yarn  add ${compilerSource} -D`)
  }
  logger.info('load compileFunciton from', path.resolve(compileFuncitonPath))
  compileFunction = require(path.resolve(compileFuncitonPath))
  const webpackSettings = config.webpack || { entry: currentEntry }
  logger.debug(webpackSettings)
  compileFunction(webpackSettings)
}

module.exports = compiler
