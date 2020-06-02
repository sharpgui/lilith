const { exec } = require('shelljs')
const globalModules = require('global-modules')
const fs = require('fs-extra')
const { join, parse } = require('path')
const walkSync = require('klaw-sync')
const logger = require('../../lib/logger')
const findupSync = require('findup-sync')

const { REACT_COMPILER, VUE_COMPILER } = require('../../config')
const { execSync } = require('child_process')

const getFilename = function(path) {
  const pathArr = path.split('/')
  const len = pathArr.length
  const fullname = pathArr[len - 1]
  const nameArr = fullname.split('.')
  const ext = nameArr.pop()
  const filename = nameArr.join('.')

  return {
    filename,
    ext
  }
}

/**
 * 判断某目录是否有对应的依赖
 * @param directory 目录
 * @param dep 依赖
 * @return Boolean
 */
const getDirectoryHasTargetDep = (directory, dep) => {
  try {
    const packageJson = fs.readJsonSync(join(directory, 'package.json'))
    const dependenciesKey = Object.keys(packageJson.dependencies || {}).concat(
      Object.keys(packageJson.devDependencies || {})
    )
    return dependenciesKey.includes(dep)
  } catch (e) {
    return false
  }
}

// const globalReactCompiler = join(__dirname, '../../../lilith-compiler')
// const globalVueCompiler = join(__dirname, '../../../VUE_COMPILER')
const globalReactCompilerPath = join(globalModules, REACT_COMPILER)
const globalVueCompilerPath = join(globalModules, VUE_COMPILER)
const reactCompilerName = REACT_COMPILER
const vueCompilerName = VUE_COMPILER

/**
 * 根据文件类型安装对应的编译源，并执行编译
 * @param {string} absolutePath 入口文件的绝对路径
 */
const checkFileTypeAndCompile = function(absolutePath, ext) {
  // 如果是js或者React文件，则使用 lilith-compiler 进行编译
  let compilerPath = ''
  let compiler = ''
  let compilerType = ''
  if (/tsx?$/.test(ext) || /jsx?$/.test(ext)) {
    compilerPath = globalReactCompilerPath
    compiler = reactCompilerName
    compilerType = 'react'
  }

  // FIXME VUE的启动文件不是vue结尾
  // 如果是vue文件，则使用 VUE_COMPILER 进行编译
  if (/vue$/.test(ext)) {
    compilerPath = globalVueCompilerPath
    compiler = vueCompilerName
    compilerType = 'vue'
  }

  if (!compiler || !compilerPath) {
    return logger.error('请检查该目录下是否包含Vue或者React文件')
  }

  // 对比cli和compiler的版本
  // compareVersion(compilerType)

  if (!fs.existsSync(compilerPath)) {
    logger.info(
      compilerPath,
      `npm i -g ${compiler} --registry=https://registry.npm.taobao.org`
    )
    exec(`npm i -g ${compiler} --registry=https://registry.npm.taobao.org`)
  }

  if (compilerType === 'react') {
    try {
      const currentDirectoryHasReact = getDirectoryHasTargetDep('.', 'react')
      if (!currentDirectoryHasReact) {
        throw new Error('未安装 React相关依赖')
      }
    } catch (e) {
      const compilerDirectoryHasReact = getDirectoryHasTargetDep(
        join(globalModules, compiler),
        'react'
      )
      if (!compilerDirectoryHasReact) {
        logger.info('检测到当前目录下未安装React，即将自动安装...')
        exec(
          'npm i --save react react-dom --registry=https://registry.npm.taobao.org',
          {
            cwd: join(globalModules, compiler)
          }
        )
      }
    }
  }

  // TODO vue

  const compileFunction = require(join(compilerPath, 'build/build.dev.js'))
  // 全局编译源对应的 node_modules 路径
  const modules = [join(globalModules, compiler, 'node_modules')]

  // 本地
  try {
    modules.push(join(parse(findupSync('package.json')).dir, 'node_modules'))
  } catch (err) {
    logger.info(err)
  }

  // logger.info('当前依赖调用目录', parse(findupSync('package.json')).dir)
  compileFunction({
    context: join(globalModules, compiler),
    entry: absolutePath,
    resolve: {
      modules
    }
  })
}

module.exports = function(dir) {
  let { ext } = getFilename(dir)
  const absolutePath = join(process.cwd(), dir)

  if (ext) {
    checkFileTypeAndCompile(absolutePath, ext)
  } else {
    // 如果是单纯的目录，则默认读取该目录下的 index 文件
    const paths = walkSync(absolutePath, { nodir: true, depthLimit: 0 })
    const filterPath = paths.filter(pathObj => {
      const { path } = pathObj
      const { filename } = getFilename(path)
      return filename === 'index'
    })

    if (filterPath.length !== 1) {
      return logger.error('请检查当前目录下是否有唯一的index文件')
    }
    ext = getFilename(filterPath[0].path).ext

    checkFileTypeAndCompile(absolutePath, ext)
  }
}
