#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const config = require('./config')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')
const newTemplate = require('./scripts/new/new')
const create = require('./scripts/create/create')
const runCompiler = require('./scripts/run/run')
updateNotifier({ pkg }).notify()
program
  .version(pkg.version, '-v, --version', 'version')
  // new
  .option(
    '--root <string>',
    '模板所在根目录,相对目录,基于context来获取root的绝对路径，默认值"_template"',
    config.root
  )
  .option(
    '--context <string>',
    'lilith.config.js文件所在目录 > 优先级package.json所在目录 > process.cwd()',
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
  // run
  .option('--mode <string>', '编译模式 template dev build', 'dev')
  .option(
    '--source <string>',
    '编译源默认值 @qfed/lilith-compiler',
    '@qfed/lilith-compiler'
  )
  .option('--type <string>', '创建的模版类型')
//create
program
  .command('new <template> <name> [target]')
  .description('Lilith 模板创建命令')
  .action(function(template, name) {
    const { target, context, root } = program.opts()
    newTemplate({ template, name, target, context, root })
  })

// 编译命令相关控制
/**
 * lilith run dev
 * lilith run buil
 * lilith run template
 * lilith run dev fex
 * lilith run build fex
 */
program
  .command('run <mode> [source]')
  .description('lilith 编译命令')
  .action(mode => {
    const { source } = program.opts()
    let currentMode = mode === 'build' ? 'prod' : mode
    runCompiler(currentMode, source)
  })

program
  .command('create [<templateName>]')
  .action((templateName = 'lilith-project', options) => {
    const { type, source } = options
    create(templateName, type, source)
  })

program.on('--help', function() {
  console.log('')
  console.log('Examples:')
  console.log('  $ lilith run dev')
  console.log('  $ lilith new template someTemplate')
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
