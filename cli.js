#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const { exit } = require('process')
const createTemplate = require('./lib/createTemplate')
const config = require('./config')
const createDevelopTemplate = require('./lib/createDevelopTemplate')
const log = console.log
const logError = str => {
  log(chalk.red(str))
  exit(1)
}
const logCorrect = str => log(chalk.keyword('green')(`\n${str}\n`))

program
  .command('new <template> <name> [target]')
  .option(
    '--root <string>',
    '模板所在根目录,相对目录,基于context来获取root的绝对路径，默认值"_template"',
    config.root
  )
  .option(
    '--context <string>',
    'qt.config.js文件所在目录 > 优先级package.json所在目录 > process.cwd()',
    config.context
  )
  .option(
    '--target <string>',
    '新生成模块的输出路径，相对process.cwd(),默认"."',
    '.'
  )
  .option(
    '--template <string>',
    '当前使用的模板，模板可选范围即root下面指定的模板，支持简写即当前有模板page那么p,pa,pag等效'
  )
  .option('--name <string>', '新生成模块的名称')
  .description('run setup commands for all envs')
  .action(function(template, name, target, options) {
    const { context, root } = options
    createTemplate({ template, name, target, context, root })
  })

// 编译命令相关控制
program.command('compile').action((directory, targetDirectory, cmd) => {
  logCorrect(`当前工作目录: ${process.cwd()}`)
  logCorrect('开始编译 >>>>>>>>>>>>>>>>>>>>>>')
  let compileFunction = () => {}
  try {
    // 从工作目录中直接去获取build配置文件，保证 react-cli 运行的版本与 yarn dev 运行的版本一致

    const compileFuncitonPath =
      process.env.NODE_ENV === 'dev'
        ? '../lilith-compiler/build/build.dev.js'
        : '@qfed/lilith-compiler/build/build.dev.js'
    log('load compileFunciton from', compileFuncitonPath)
    compileFunction = require(compileFuncitonPath)
  } catch (e) {
    logError(e)
  }
  const relativePath = path.relative(
    __dirname,
    `${process.cwd()}/webpack.config.js`
  )
  try {
    const webpackSettings = require(`./${relativePath}`)
    console.info('读取本地配置', relativePath)
    compileFunction(webpackSettings)
  } catch (err) {
    compileFunction()
  }
})

program.command('create [<templateName>]').action((templateName = 'page') => {
  createDevelopTemplate(templateName)
})

program.parse(process.argv)
