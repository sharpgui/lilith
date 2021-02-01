const { join } = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const { green } = require('../../lib/color')
// const copyCompile = require('./copyCompile')
// const creacteReactApp = require('./react/creacteReactApp')
// const createVueScaffold = require('./vue/createVueScaffold')
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
    }
  ])
  return result
}

const createLilithConfigFile = function(targetPath) {
  return fs.outputFileSync(`${targetPath}/lilith.config.js`, lilithConfigFile)
}

function creatorfactory(type) {
  return target => {
    createTemplate(type, target)
    console.log(green(`create ${target} succeed!`))
  }
}

async function createTemplate(type, target) {
  const fromTemplatePath = join(__dirname, '..', '..', '_template', type)
  if (fs.pathExistsSync(target)) {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        default: false,
        name: 'doExist',
        message: '检测到目录已存在，是否覆盖？ >'
      }
    ])
    const { doExist } = answer
    if (doExist) {
      return fs.copySync(fromTemplatePath, target)
    }
  }
  fs.copySync(fromTemplatePath, target)
}

module.exports = async function(templateName) {
  // 命令行文件所在相对路径
  const inquireResult = await inquireConfig()
  const { frame } = inquireResult
  const creator = creatorfactory(frame)
  creator(templateName)
}
