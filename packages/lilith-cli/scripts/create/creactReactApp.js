const shell = require('shelljs')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../../lib/logger')

const copyFile = function (srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath)
  rs.on('error', function (err) {
    if (err) {
      console.log('read error', srcPath)
    }
    cb && cb(err)
  })

  var ws = fs.createWriteStream(tarPath)
  ws.on('error', function (err) {
    if (err) {
      console.log('write error', tarPath)
    }
    cb && cb(err)
  })
  ws.on('close', function (ex) {
    cb && cb(ex)
  })

  rs.pipe(ws)
}

const copyFolder = function (srcDir, tarDir) {
  fs.readdir(srcDir, function (err, files) {
    var count = 0
    var checkEnd = function () {
      ++count == files && files.length
    }

    if (err) {
      checkEnd()
      return
    }

    files.forEach(function (file) {
      var srcPath = path.join(srcDir, file)
      var tarPath = path.join(tarDir, file)
      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath)
          fs.mkdir(tarPath, function (err) {
            if (err) {
              console.log(err)
              return
            }
            copyFolder(srcPath, tarPath, checkEnd)
          })
        } else {
          copyFile(srcPath, tarPath, checkEnd)
        }
      })
    })
    //为空时直接回调
    files.length === 0
  })
}
const removeFolder = function (p) {
  return new Promise((resolve, reject) => {
    //返回一个promise对象
    fs.stat(p, (err, statObj) => {
      // 异步读取文件判断文件类型 是目录 递归 否则就删除即可
      if (statObj.isDirectory()) {
        fs.readdir(p, function (err, dirs) {
          //读取p下面的文件
          // 映射路径
          dirs = dirs.map((dir) => path.join(p, dir))
          // 映射promise
          dirs = dirs.map((dir) => removeFolder(dir)) // 递归调用，p下面的文件再次调用判断删除方法
          // 删除完儿子后 删除自己
          Promise.all(dirs).then(() => {
            fs.rmdir(p, resolve)
          })
        })
      } else {
        fs.unlink(p, resolve)
      }
    })
  })
}

const downloadTemplate = function (path) {
  shell.exec('git init', { cwd: path })
  shell.exec(
    'git remote add -f origin git@github.com:facebook/create-react-app.git',
    { cwd: path }
  )
  shell.exec('git config core.sparsecheckout true', { cwd: path })
  shell.exec('echo packages/cra-template >> .git/info/sparse-checkout', {
    cwd: path,
  })
  shell.exec('git pull origin master', { cwd: path })
}

module.exports = async () => {
  const path = '/Users/qudian/Downloads/lili1'
  fs.ensureDirSync(path)
  await downloadTemplate(path)
  await copyFolder(path + '/packages/cra-template', path, path)
  removeFolder(path + '/packages')
}
