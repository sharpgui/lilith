const download = require('download-git-repo')
const inquirer = require('inquirer')
const fs = require('fs-extra')

module.exports = (url, directory) => {
  if (fs.existsSync(directory)) {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([
          {
            type: 'confirm',
            default: false,
            name: 'force',
            message: '检测到目录已存在，是否覆盖？',
          },
        ])
        .then(answer => {
          if (answer.force) {
            fs.removeSync(directory)
            download(url, directory, { clone: true }, err => {
              if (!err) {
                return resolve(true)
              } else {
                return reject(err)
              }
            })
          } else {
            return reject('停止安装 !')
          }
        })
    })
  }
  return new Promise((resolve, reject) => {
    download(url, directory, { clone: true }, err => {
      if (!err) {
        return resolve(true)
      }
      return reject(err)
    })
  })
}
