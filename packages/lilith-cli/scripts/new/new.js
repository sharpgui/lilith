const path = require('path')
const fs = require('fs')
const { blue } = require('../../lib/color')
const { createNewModule } = require('quickly-template/lib/createTemplate')
const { ask } = require('quickly-template/lib/rl')
const glob = require('glob')
const logger = require('../../lib/logger')
const GlobalTemplateRoot = path.join(__dirname, '..', '..', '_template')

function findTemplate(argv) {
  const { root, context } = argv
  let res = ['react', 'vue']
  const local = glob.sync(path.join(context, root, '!(*.*)')).map(filePath => {
    return path.parse(filePath).name
  })
  res.push(...local)
  console.log(res, local)
  return res
}

function getTemplate(argv) {
  const { template } = argv
  const tempaltes = findTemplate(argv)
  console.log(tempaltes)
  const match = []
  tempaltes.forEach(item => {
    if (item.startsWith(template)) match.push(item)
  })
  return match
}

async function createTemplate(argv) {
  const { name, context, root, target = '', filter, isDebug } = argv
  const [template] = getTemplate(argv)

  if (!template) {
    const templates = findTemplate(argv)

    logger.info('当前可用的模板有', templates)
    return
  }
  console.log(template)
  let rootDir = path.join(context, root)
  if (template === 'react' || template === 'vue') {
    rootDir = GlobalTemplateRoot
  }

  const globPattern = path.join(rootDir, template, 'src', '**', '*.*')
  console.log(globPattern)
  // isDebug参数是因为debug的时候俺不知道怎么answer
  if (!isDebug && fs.existsSync(path.join(target, name))) {
    const answer = await ask(blue(`${name}已经存在是否覆盖？(Y/N)`))

    if (answer.toLowerCase() === 'n') return
  }
  const nameArray = name ? name.split('/') : ['']
  const nameArrayLength = nameArray.length
  let renderOptions = { name, dirname: nameArray[nameArrayLength - 1] }
  try {
    renderOptions = { ...renderOptions, ...filter[template] }
  } catch (error) {} // eslint-disable-line
  // debug('createNewModule',{ globPattern, target, renderOptions, name ,argv})
  createNewModule({ globPattern, target, renderOptions, name }, argv)
  logger.info('create new', template, path.join(context, target, name), 'done!')
}

module.exports = createTemplate
