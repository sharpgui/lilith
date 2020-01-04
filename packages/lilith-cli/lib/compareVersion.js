const globalModules = require('global-modules')
const fs = require('fs-extra')
const { join } = require('path')
const { exec } = require('shelljs')
const logger = require('./logger')
const globalReactCompiler = 'lilith-compiler'
const globalVueCompiler = 'lilith-compiler-vue'
const globalLilithPath = join(globalModules, 'lilith-cli')

module.exports = function(compilerType = 'react') {
  const compiler =
    compilerType === 'react' ? globalReactCompiler : globalVueCompiler
  const compilerPath = join(globalModules, compiler)
  try {
    const lilithPackage = fs.readJSONSync(
      join(globalLilithPath, './package.json')
    )
    const lilithVersion = lilithPackage.version
    const compilerPackage = fs.readJSONSync(
      join(compilerPath, './package.json')
    )
    const compilerVersion = compilerPackage.version
    if (lilithVersion !== compilerVersion) {
      logger.info('检测到cli版本和编译源不一致，更新编译源')
      logger.info(`npm i -g ${compiler}@${lilithVersion}`)
      exec(`npm i -g ${compiler}@${lilithVersion}`)
    }
  } catch (err) {
    logger.error(err)
  }
}
