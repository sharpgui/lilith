const debug = require('debug')('lilith:cli')
const fs = require('fs')
const findup = require('findup-sync')
const path = require('path')
let context = process.cwd()
let root = '_template'
let config = {}

// context 优先级 qt.config.js > package.json > cwd
try {
  context = path.dirname(findup('package.json'))
} catch (error) {
  debug('没有找到package.json')
}
try {
  const configFilePath = findup('lilith.js')
  context = path.dirname(configFilePath)
  config = require(path.resolve(configFilePath))
} catch (error) {
  debug(error)
}
if (fs.existsSync(path.resolve(context, '_template'))) {
  root = '_template'
}

module.exports = {
  ...{ rename: false, filter: {} },
  context,
  root,
  ...config
}
