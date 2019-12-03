// 监听文件变化，并将更改后的内容注入到.lilith目录中
const fs = require('fs-extra')
const chokidar = require('chokidar')
const { join, relative } = require('path')
const { createNewModule } = require('quickly-template/lib/createTemplate')

function fileWatcher() {
  const watcher = chokidar.watch(`${process.cwd()}/src`)

  watcher.on('all', function(event, path) {
    const pathArr = path.split('/')
    const len = pathArr.length
    const filename = pathArr[len - 1]
    // 如果是添加文件，则将该文件进行一次编译处理之后拷贝到目标目录
    let from = ''
    let to = ''
    switch (event) {
    case 'change':
    case 'add': {
      const relativePath = relative(path, process.cwd())
      from = path
      to = join(
        path,
        relativePath,
        '.lilith',
        from.split('/src/')[1].replace(filename, '')
      )
      break
    }
    case 'unlink': {
      return fs.removeSync(join(path, '../..', '.lilith', filename))
    }
    }
    event !== 'addDir' &&
      from &&
      createNewModule({
        globPattern: from,
        target: to,
        renderOptions: { name: 'Template' },
        name: ''
      })
  })
}

module.exports = fileWatcher
