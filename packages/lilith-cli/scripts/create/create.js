const { join } = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const download = require('./download')
const copyCompile = require('./copyCompile')
// TODO 填写为真正的脚手架地址
const lilithScaffold = 'lilith-scaffold: https://test.com'
const lilithConfigFile = `module.exports = {
  // 自定义webpack配置
  webpack: {
  },
  // 自定义compile脚本的源
  compiler: {
  }
}`

const inquireConfig = async function(type, source) {
  const questionArray = [
    {
      type: 'list',
      choices: ['page-template 开发页面模版', 'scafold 项目脚手架'],
      default: 'page-template 开发页面模版',
      name: 'templateType',
      message: '请选择需要生成的模版类型 >'
    },
    {
      type: 'confirm',
      name: 'lang',
      message: '是否使用Typescript？',
      default: true
    }
    // TODO  React Vue 区分
    // {
    //   type: 'list',
    //   choices: ['React', 'Vue'],
    //   default: 'React',
    //   name: 'frame',
    //   message: '请选择使用的开发框架？'
    // }
  ]
  type && questionArray.shift()
  const answer = await inquirer.prompt(questionArray)

  const { templateType = type } = answer

  if (
    templateType === 'page-template 开发页面模版' ||
    templateType === 'template'
  ) {
    return { ...answer, templateType: 'template' }
  }
  let scaffoldUrl = {}
  if (!source) {
    scaffoldUrl = await inquirer.prompt([
      {
        type: 'input',
        name: 'scaffoldUrl',
        message: '请输入脚手架的下载源，不填则默认下载Lilith官方scaffold >',
        default: lilithScaffold
      }
    ])
  }

  return {
    ...answer,
    templateType: 'scaffold',
    scaffoldUrl: scaffoldUrl['scaffoldUrl'] || source
  }
}

const inquireFileExistAndCopyTemplate = async function(
  fromPath,
  targetPath,
  lang
) {
  if (fs.pathExistsSync(targetPath)) {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        default: false,
        name: 'exist',
        message: '检测到目录已存在，是否覆盖？ >'
      }
    ])
    const { exist } = answer
    if (exist) {
      return copyCompile(fromPath, targetPath, !lang)
    }
  }

  return copyCompile(fromPath, targetPath, !lang)
}

const createLilithConfigFile = function(targetPath) {
  return fs.outputFileSync(`${targetPath}/lilith.config.js`, lilithConfigFile)
}

module.exports = async function(templateName, type, source) {
  const targetTemplatePath = join(process.cwd(), '_template', templateName)
  const fromTemplatePath = join(__dirname, '..', '..', '_template', 'template')
  const scaffoldTarget = join(process.cwd(), templateName)
  const inquireResult = await inquireConfig(type, source)
  const { templateType, lang, frame, scaffoldUrl } = inquireResult
  // 如果选择模版开发
  if (templateType === 'template') {
    return inquireFileExistAndCopyTemplate(
      fromTemplatePath,
      targetTemplatePath,
      lang
    )
  }

  // 如果选择脚手架
  if (templateType === 'scaffold') {
    return download(scaffoldUrl, templateName).then(
      createLilithConfigFile.bind(this, scaffoldTarget)
    )
  }
}
