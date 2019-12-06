#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const createTemplate = require('./lib/createTemplate')
const config = require('./config')
const createDevelopTemplate = require('./lib/createDevelopTemplate')
const logger = require('./lib/logger')

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
/**
 * lilith run  dev
 * lilith run  dev h5
 * lilith run  dev weapp
 * lilith run build
 */
program
  .command('run <mode> [type]')
  .option('--mode <string>', '编译模式 dev build', 'dev')
  .option('--type <string>', '编译类型 lilih h5 weapp', 'lilith')
  .action((mode, type) => {
    logger.info(type)
    logger.info(`当前工作目录: ${process.cwd()}`)
    let compileFunction = () => {}
    // 从工作目录中直接去获取build配置文件，保证 react-cli 运行的版本与 yarn dev 运行的版本一致
    const currentBuildType = type === 'lilith' ? '.lilith' : ''
    const compileFuncitonPath =
      process.env.NODE_ENV === 'dev'
        ? `../lilith-compiler/build/build.dev${currentBuildType}.js`
        : `@qfed/lilith-compiler/build/build.dev${currentBuildType}.js`
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
  })

program.command('create [<templateName>]').action((templateName = 'page') => {
  createDevelopTemplate(templateName)
})

program.parse(process.argv)
