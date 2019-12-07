#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const config = require('./config')

const createTemplate = require('./lib/createTemplate')
const create = require('./lib/create')
const compiler = require('./lib/compiler')

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
    compiler(mode, source)
  })

program
  .command('create [<templateName>]')
  .option('--type <string>', '创建的模版类型')
  .option('--source <string>', 'scaffolding 的源链接')
  .action((templateName = 'lilith-project', options) => {
    const { type, source } = options
    create(templateName, type, source)
  })

program.parse(process.argv)
