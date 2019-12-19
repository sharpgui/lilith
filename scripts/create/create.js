const { join } = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const download = require('./download')
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

const inquireConfig = async function() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      choices: ['page-template 开发页面模版', 'scafold 项目脚手架'],
      default: 'page-template 开发页面模版',
      name: 'templateType',
      message: '请选择需要生成的模版类型 >'
    }
  ])

  const { templateType } = answer

  if (templateType === 'page-template 开发页面模版') {
    return 'developTemplate'
  }

  const scaffoldUrl = await inquirer.prompt([
    {
      type: 'input',
      name: 'scaffoldUrl',
      message: '请输入脚手架的下载源，不填则默认下载Lilith官方scaffold >'
    }
  ])

  return scaffoldUrl['scaffoldUrl']
}

const inquireFileExistAndCopyTemplate = async function(fromPath, targetPath) {
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
      return fs.copySync(fromPath, targetPath)
    }
  }

  return fs.copySync(fromPath, targetPath)
}

const createLilithConfigFile = function(targetPath) {
  return fs.outputFileSync(`${targetPath}/lilith.config.js`, lilithConfigFile)
}

module.exports = async function(templateName, type, source) {
  const targetTemplatePath = join(process.cwd(), '_template', templateName)
  const fromTemplatePath = join(__dirname, '..', '..', '_template', 'template')
  const scaffoldTarget = join(process.cwd(), templateName)

  if (type === 'template') {
    return inquireFileExistAndCopyTemplate(fromTemplatePath, targetTemplatePath)
  }

  if (type === 'scaffold') {
    if (!source) {
      const sourceUrl = await inquirer.prompt([
        {
          type: 'input',
          name: 'scaffoldUrl',
          message: '请输入脚手架的下载源，不填则默认下载Lilith官方scaffold >'
        }
      ])
      return download(sourceUrl['scaffoldUrl'], templateName).then(
        createLilithConfigFile.bind(this, scaffoldTarget)
      )
    }

    return download(source, templateName).then(
      createLilithConfigFile.bind(this, scaffoldTarget)
    )
  }

  let inquireResult = await inquireConfig()

  // 如果选择模版开发
  if (inquireResult === 'developTemplate') {
    return inquireFileExistAndCopyTemplate(fromTemplatePath, targetTemplatePath)
  }
  !inquireResult && (inquireResult = lilithScaffold)
  // 如果选择脚手架, 则直接在当前目录下载
  return download(inquireResult, templateName).then(
    createLilithConfigFile.bind(this, scaffoldTarget)
  )
}
