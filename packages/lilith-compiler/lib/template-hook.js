const { join } = require('path')
const { createNewModule } = require('quickly-template/lib/createTemplate')
const fs = require('fs-extra')
const fileWatcher = require('./fileWatcher')

createNewModule({
  globPattern: 'src/*.tsx',
  target: '.lilith/src',
  renderOptions: { name: 'LilithTemplate' },
  name: ''
})
fs.copySync(join(__dirname, '../template'), join(process.cwd(), './.lilith'))
fileWatcher()
