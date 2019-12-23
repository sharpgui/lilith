// 拷贝并使用babel-typescript去除typescript语法
const walkSync = require('klaw-sync')
const logger = require('../../lib/logger')
const fs = require('fs-extra')
const babel = require('@babel/core')
const { join } = require('path')
const template = require('quickly-template/lib/art-template')

template.defaults.rules.push({
  test: /__([\w\W]*?)_([\w\W]*?)__/,
  use: function(match, code, rule) {
    return {
      code: '$imports.' + rule + '(' + code + ')',
      output: 'escape'
    }
  }
})

const getFilename = function(path) {
  const pathArr = path.split('/template')
  const len = pathArr.length
  const fullname = pathArr[len - 1]
  const nameArr = fullname.split('.')
  const ext = nameArr.pop()
  const filename = nameArr.join('.')

  return {
    filename: filename,
    ext
  }
}

module.exports = function(from, to, needCompile = false) {
  if (!needCompile) {
    return fs.copySync(from, to)
  }
  let paths = []
  try {
    paths = walkSync(from, { nodir: true })
  } catch (err) {
    logger.error(err)
  }
  paths.forEach(p => {
    const { path } = p
    const { filename, ext } = getFilename(path)
    if (/\.tsx?$/.test(path)) {
      const { code } = babel.transformFileSync(path, {
        presets: ['@babel/preset-typescript'],
        cwd: join(__dirname, '../..')
      })

      fs.outputFileSync(`${to}${filename}.js`, code)
    } else {
      fs.copySync(path, `${to}${filename}.${ext}`)
    }
  })
}
