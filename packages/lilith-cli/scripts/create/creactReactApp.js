const shell = require('shelljs')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../../lib/logger')

const downloadTemplate = function(tempPath) {
  shell.exec('git init', { cwd: tempPath })
  shell.exec(
    'git remote add -f origin git@github.com:facebook/create-react-app.git',
    { cwd: tempPath }
  )
  shell.exec('git config core.sparsecheckout true', { cwd: tempPath })
  shell.exec('echo packages/cra-template >> .git/info/sparse-checkout', {
    cwd: tempPath
  })
  shell.exec('git pull origin master', { cwd: tempPath })
}

const updatePackagejson = function(packageJsonFile) {
  fs.outputFile(
    packageJsonFile,
    `
    {
      "scripts": {
        "dev": "lilith run dev",
        "mock": "jsr -r mock -p 3001 -w",
        "test": "echo 'Error: no test specified' && exit 1"
      },
      "keywords": [
        "cli",
        "webpack",
        "babel",
        "compiler"
      ],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "react": "^16.13.1",
        "react-dom": "^16.13.1"
      },
      "devDependencies": {
        "lilith-compiler": "^1.2.4"
      }
    }
  `
  )
}

module.exports = async name => {
  const tempPath = path.resolve('.lilith-temp')
  fs.ensureDirSync(tempPath)
  await downloadTemplate(tempPath)
  await fs.copy(
    tempPath + '/packages/cra-template',
    path.resolve(name),
    async () => {
      await fs.remove(tempPath + '/packages')
      const packageJsonFile = path.join(path.resolve(name), './package.json')
      logger.info(packageJsonFile)
      await updatePackagejson(packageJsonFile)
    }
  )
}
