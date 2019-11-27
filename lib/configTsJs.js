const fs = require('fs-extra')

// 对于是否使用 typescript / javascript 的统一配置函数
module.exports = function(packageJSON, template, templatePath, typescript) {
  if (template === 'empty' && typescript) {
    fs.copySync(`${templatePath}/src-ts`, `${templatePath}/src`)
    fs.copySync(
      `${templatePath}/webpack.ts`,
      `${templatePath}/webpack.config.js`
    )
  }

  if (template === 'empty' && !typescript) {
    fs.copySync(`${templatePath}/src-js`, `${templatePath}/src`)
    fs.copySync(
      `${templatePath}/webpack.js`,
      `${templatePath}/webpack.config.js`
    )
    fs.removeSync(`${templatePath}/tsconfig.json`)
    delete packageJSON.devDependencies['tsconfig-paths-webpack-plugin']

    for (let key in packageJSON.devDependencies) {
      ;/^@types\//.test(key) && delete packageJSON.devDependencies[key]
    }
  }

  fs.removeSync(`${templatePath}/src-js`)
  fs.removeSync(`${templatePath}/src-ts`)
  fs.removeSync(`${templatePath}/webpack.js`)
  fs.removeSync(`${templatePath}/webpack.ts`)
}
