const shell = require('shelljs')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../../../lib/logger')

const downloadTemplate = function(tempPath, reactAppPath) {
  shell.exec('git init', { cwd: tempPath })
  shell.exec(
    'git remote add -f origin https://github.com/facebook/create-react-app.git',
    { cwd: tempPath }
  )
  shell.exec('git config core.sparsecheckout true', { cwd: tempPath })
  shell.exec(`echo ${reactAppPath} >> .git/info/sparse-checkout`, {
    cwd: tempPath
  })
  shell.exec('git pull origin master', { cwd: tempPath })
}

const updatePackagejson = function(packageJsonFile) {
  fs.outputFile(
    packageJsonFile,
    `{
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
    "lilith-compiler": "latest"
  }
}
`
  )
}

module.exports = async (name, lang) => {
  const tempPath = path.resolve('.lilith-temp')
  const reactAppPath = lang
    ? '/packages/cra-template-typescript/template'
    : '/packages/cra-template/template'
  await fs.remove(path.join(tempPath, './.git'))
  await fs.ensureDirSync(tempPath)
  await downloadTemplate(tempPath, reactAppPath)
  await fs.copy(tempPath + reactAppPath, path.resolve(name))
  await fs.remove(tempPath)
  const packageJsonFile = path.join(path.resolve(name), './package.json')
  logger.info(packageJsonFile)
  await updatePackagejson(packageJsonFile)
  const indexFilePath = path.join(
    path.resolve(name),
    'src',
    lang ? 'index.tsx' : 'index.js'
  )
  await fs.ensureFileSync(indexFilePath)
  let indexContent = fs.readFileSync(indexFilePath, 'utf8')
  indexContent = indexContent.replace('reportWebVitals();', '')
  await fs.writeFileSync(indexFilePath, indexContent, 'utf8')
}
