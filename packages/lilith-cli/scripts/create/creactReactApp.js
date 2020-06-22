const shell = require('shelljs')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../../lib/logger')

const downloadTemplate = function(path) {
  shell.exec('git init', { cwd: path })
  shell.exec(
    'git remote add -f origin git@github.com:facebook/create-react-app.git',
    { cwd: path }
  )
  shell.exec('git config core.sparsecheckout true', { cwd: path })
  shell.exec('echo packages/cra-template >> .git/info/sparse-checkout', {
    cwd: path
  })
  shell.exec('git pull origin master', { cwd: path })
}

module.exports = async name => {
  const tempPath = path.resolve('.lilith-temp')
  fs.ensureDirSync(tempPath)
  await downloadTemplate(tempPath)
  await fs.copy(tempPath + '/packages/cra-template', path.resolve(name), () => {
    fs.remove(tempPath + '/packages')
  })
}
