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
  .description('new <template> <name> [target]')
  .action(function(template, name, target, options) {
    const { context, root } = options
    createTemplate({ template, name, target, context, root })
  })

// 编译命令相关控制
/**
 * lilith run dev
 * lilith run build
 * lilith run template
 * lilith run dev fex
 * lilith run build fex
 */
program
  .command('run <mode> [source]')
  .option('--mode <string>', '编译模式 template dev build', 'dev')
  .option(
    '--source <string>',
    '编译源默认值 @qfed/lilith-compiler',
    '@qfed/lilith-compiler'
  )
  .description('run <mode> [type]')
  .action((mode, source = '@qfed/lilith-compiler') => {
    logger.info(`当前工作目录: ${process.cwd()}`)
    let compileFunction = () => {}
    // 从工作目录中直接去获取build配置文件，保证 react-cli 运行的版本与 yarn dev 运行的版本一致
    const currentSource =
      process.env.NODE_ENV === 'dev' ? '../lilith-compiler' : source
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
  })

program.command('create [<templateName>]').action((templateName = 'page') => {
  createDevelopTemplate(templateName)
})

program.parse(process.argv)
