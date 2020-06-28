const shell = require('shelljs')
const { resolve } = require('path')
const presetUrl = {
  ts: './preset-ts.json',
  js: './preset-js.json'
}
module.exports = function(templateName, useTs = false) {
  const lang = useTs ? 'ts' : 'js'

  return shell.exec(`npx @vue/cli create --preset ${resolve(__dirname, presetUrl[lang])} ${templateName}`)
}