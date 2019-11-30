#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const package = require('./package.json')
const fs = require('fs-extra')
const path = require('path')
const { execSync, exec } = require('child_process')
const { exit } = require('process')
const question = require('./lib/inquire')
const download = require('./lib/download')
const configTsJs = require('./lib/configTsJs')
const createDevelopTemplate = require('./lib/createDevelopTemplate')

const log = console.log
const logError = str => {
  log(chalk.red(str))
  exit(1)
}
const logCorrect = str => log(chalk.keyword('green')(`\n${str}\n`))

const templateUrlMap = {
  // TODO Template URL
}

// 拷贝下载项目的函数
const cpBoilerplate = (directory, template) => {
  // TODO 目前仅支持react template，后续可以通过template选择使用ditto的template
  logCorrect('start create boilerplate....')
  return download(templateUrlMap[template], directory)
}

// 生成目录并构建项目
const createBoilerplate = (appName, directory, template = 'react') => {
  return cpBoilerplate(`${directory}/${appName}`, template)
}

// 根据配置设定packageJson的内容
const setPackageJson = settings => {
  const {
    projectName,
    author,
    description,
    appName,
    directory,
    typescript,
    template,
  } = settings
  const packageJsonPath = `${directory}/${appName}/package.json`
  const packageJson = fs.readJSONSync(packageJsonPath)
  packageJson.name = projectName
  packageJson.author = author
  packageJson.description = description

  // TODO 目前只支持empty模版类型的typescript可选配置
  const templatePath = `${directory}/${appName}`
  configTsJs(packageJson, template, templatePath, typescript)

  // TODO 根据是否接入Grace进行模版配置

  try {
    fs.writeJsonSync(packageJsonPath, packageJson)
  } catch (err) {
    logError(err)
    return false
  }
  return true
}

// 自动安装boilerplate的依赖
const npmInstall = (appName, directory) => {
  logCorrect('initializing packages....')
  try {
    execSync('npm install', {
      cwd: `${directory}/${appName}/`,
      stdio: [process.stdin, process.stdout, process.stderr],
    })
  } catch (e) {
    logError(e)
  }
  return true
}

// 自动配置git相关的命令
const setGit = answerObj => {
  const { git, appName, directory } = answerObj
  if (!git) {
    logCorrect('install react-boilerplate successfully !!!!')
    return true
  }
  try {
    execSync(`git init && git remote add origin ${git}`, {
      cwd: `${directory}/${appName}/`,
      stdio: [process.stdin, process.stdout, process.stderr],
    })
  } catch (e) {
    logError(e)
  }
  logCorrect('install react-boilerplate successfully !!!!')
  return true
}

// 创建命令相关控制
// program
//   .version(package.version)
//   .command('create <appName> [<directory>]')
//   .action((appName, directory = '.', cmd) => {
//     // 询问package.json的相关属性
//     question(appName).then(answer => {
//       const { confirm, template } = answer
//       if (confirm) {
//         createBoilerplate(appName, directory, template)
//           .then(
//             res =>
//               res &&
//               setPackageJson({ ...answer, appName, directory }) &&
//               npmInstall(appName, directory) &&
//               setGit({ ...answer, appName, directory })
//           )
//           .catch(err => logError(err))
//       } else {
//         logError('canceled create boilerplate !!!!')
//       }
//     })
//   })

// 编译命令相关控制
program.command('compile').action((directory, targetDirectory, cmd) => {
  logCorrect(`当前工作目录: ${process.cwd()}`)
  logCorrect('开始编译 >>>>>>>>>>>>>>>>>>>>>>')
  let compileFunction = () => {}
  try {
    // 从工作目录中直接去获取build配置文件，保证 react-cli 运行的版本与 yarn dev 运行的版本一致
    compileFunction = require(`./node_modules/@qfed/lilith-compiler/build/build.dev.js`)
  } catch (e) {
    logError(e)
  }
  const relativePath = path.relative(
    __dirname,
    `${process.cwd()}/webpack.config.js`
  )
  try {
    const webpackSettings = require(`./${relativePath}`)
    compileFunction(webpackSettings)
  } catch (err) {
    compileFunction()
  }
})

program.command('create [<templateName>]').action((templateName = 'page') => {
  createDevelopTemplate(templateName)
})


program.parse(process.argv)
