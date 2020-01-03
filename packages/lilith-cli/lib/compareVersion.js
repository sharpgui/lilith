const globalModules = require('global-modules')
const fs = require('fs-extra')
const { join } = require('path')
const { exec } = require('shelljs')
const logger = require('./logger')
const globalReactCompiler = '@qfed/lilith-compiler'
const globalVueCompiler = '@qfed/lilith-compiler-vue'
const globalLilithPath = join(globalModules, '@qfed/lilith')

module.exports = function(compilerType = 'react') {
  const compiler =
    compilerType === 'react' ? globalReactCompiler : globalVueCompiler
  const compilerPath = join(globalModules, compiler)
  try {
    const lilithPackage = fs.readJSONSync(
      join(globalLilithPath, './package.json')
    )
    const lilithVersion = lilithPackage.version
    const compilerPackage = fs.readJSONSync(compilerPath)
    const compilerVersion = compilerPackage.version
    if (lilithVersion !== compilerVersion) {
      exec(`npm i -g ${compiler}@${lilithVersion}`)
    }
  } catch (err) {
    logger.error(err)
  }
}
