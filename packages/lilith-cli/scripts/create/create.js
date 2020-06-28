const { join } = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const download = require('./download')
const copyCompile = require('./copyCompile')
const creacteReactApp = require('./react/creacteReactApp')
const createVueScaffold = require('./vue/createVueScaffold')
const lilithConfigFile = `module.exports = {
  // 自定义webpack配置
  webpack: {
  },
  // 自定义compile脚本的源
  compiler: {
  }
}`
// 是否使用Typescript？
const inquireLanguage = async function(type = 'template') {
  const lang = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'lang',
      message: '是否使用Typescript？',
      default: false
    }
  ])
  return { lang: lang.lang, templateType: type }
}

const inquireConfig = async function(type, source) {
  const questionArray = [
    {
      type: 'list',
      choices: ['page-template 开发页面模版', 'scaffold 项目脚手架'],
      default: 'page-template 开发页面模版',
      name: 'templateType',
      message: '请选择需要生成的模版类型 >'
    }
  ]
  type && questionArray.shift()
  const answer = await inquirer.prompt(questionArray)

  const { templateType = type } = answer

  if (
    templateType === 'page-template 开发页面模版' ||
    templateType === 'template'
  ) {
    const lang = await inquireLanguage('template')
    return {
      ...answer,
      ...lang
    }
  }

  const frameInquirer = await inquirer.prompt([
    {
      type: 'list',
      choices: ['React', 'Vue', '自定义'],
      default: 'React',
      name: 'frame',
      message: '请选择使用的开发框架？'
    }
  ])
  const { frame } = frameInquirer

  if (frame === 'React' || frame === 'Vue') {
    const lang = await inquireLanguage('scaffold')
    return {
      ...answer,
      frame,
      ...lang
    }
  }
  let scaffoldUrl = {}
  if (!source) {
    scaffoldUrl = await inquirer.prompt([
      {
        type: 'input',
        name: 'scaffoldUrl',
        message: '请输入脚手架的下载源',
        default: ''
      }
    ])
  }

  return {
    ...answer,
    frame,
    templateType: 'scaffold',
    scaffoldUrl: scaffoldUrl['scaffoldUrl'] || source
  }
}

const inquireFileExistAndCopyTemplate = async function(
  fromPath,
  targetPath,
  lang
) {
  console.log(fromPath, targetPath, lang)
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
      fs.removeSync(targetPath)
      return copyCompile(fromPath, targetPath, !lang)
    }
  }

  return copyCompile(fromPath, targetPath, !lang)
}

const createLilithConfigFile = function(targetPath) {
  return fs.outputFileSync(`${targetPath}/lilith.config.js`, lilithConfigFile)
}

module.exports = async function(templateName, type, source) {
  const targetTemplatePath = join(process.cwd(), templateName)
  // 命令行文件所在相对路径
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
  else if (templateType === 'scaffold') {
    // 根据选择的frame来处理
    switch (frame) {
    // 如果是React则从create-react-app拉取
    case 'React': {
      return creacteReactApp(templateName, lang)
    }
    // 如果是vue则从@vue/cli下拉取
    case 'Vue': {
      return createVueScaffold(templateName, lang)
    }
    // 如果是自定义则直接拉取提供的URL
    case '自定义': {
      return download(scaffoldUrl, templateName).then(
        createLilithConfigFile.bind(this, scaffoldTarget)
      )
    }
    }
  }
}
