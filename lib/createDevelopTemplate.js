const { join } = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')

module.exports = function(templateName) {
  const targetPath = join(process.cwd(), '_template', templateName)
  const fromPath = join(__dirname, '..', 'template')
  if (fs.pathExistsSync(targetPath)) {
    inquirer.prompt([
      {
        type: 'confirm',
        default: false,
        name: 'exist',
        message: '检测到目录已存在，是否覆盖？ >',
      }
    ]).then(async answer => {
      const { exist } = answer
      if (exist) {
        fs.copySync(fromPath, targetPath, { filter: function(file) {
          return !/\.lilith/.test(file) && !/dist/.test(file) && !/node_modules/.test(file)
        }})
      }
    })
  }

  fs.copySync(fromPath, targetPath, { filter: function(file) {
    return !/\.lilith/.test(file) && !/dist/.test(file) && !/node_modules/.test(file)
  }})
}