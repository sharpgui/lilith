const { join } = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const copyCompile = require('./copyCompile')
const creacteReactApp = require('./react/creacteReactApp')
const createVueScaffold = require('./vue/createVueScaffold')
const lilithConfigFile = `module.exports = {
  // 自定义webpack配置
  webpack: {
  }
}`

const inquireConfig = async function() {
  const result = await inquirer.prompt([
    {
      type: 'list',
      choices: ['React', 'Vue', 'Template'],
      default: 'React',
      name: 'frame'
    },
    {
      type: 'confirm',
      name: 'lang',
      message: '是否使用Typescript？',
      default: false
    }
  ])
  return result
}
// template
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
function createTemplate(templateName, lang) {
  const fromTemplatePath = join(__dirname, '..', '..', '_template', 'template')
  inquireFileExistAndCopyTemplate(fromTemplatePath, templateName, lang)
}

const creatorfactory = frame => {
  const createMap = {
    React: creacteReactApp,
    Vue: createVueScaffold,
    Template: createTemplate
  }
  return createMap[frame]
}
module.exports = async function(templateName) {
  // 命令行文件所在相对路径
  const inquireResult = await inquireConfig()
  const { lang, frame } = inquireResult
  const creator = creatorfactory(frame)
  creator(templateName, lang)
}
