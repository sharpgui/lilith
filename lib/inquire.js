const inquirer = require('inquirer')

const questionKeyMap = {
  template: '选择的模版',
  typescript: '使用typescript',
  projectName: '项目名称',
  author: '作者',
  description: '项目描述',
  git: 'git地址',
}

module.exports = defaultName =>
  inquirer
    .prompt([
      {
        type: 'list',
        choices: ['react', 'ditto', 'empty', 'platform'],
        default: 'react',
        name: 'template',
        message:
          '请选择使用的模版（目前仅支持react, empty选项为开发中的业务模版, platform为后台管理开发模版）>',
      },
      {
        type: 'confirm',
        default: true,
        name: 'typescript',
        message: '是否使用typescript >',
      },
      {
        type: 'input',
        name: 'projectName',
        default: defaultName || 'awesome-project',
        message: '请输入项目名称 >',
      },
      {
        type: 'input',
        name: 'author',
        default: '',
        message: '请输入作者 >',
      },
      {
        type: 'input',
        name: 'description',
        default: 'react project',
        message: '请输入项目描述 >',
      },
      {
        type: 'input',
        name: 'git',
        default: '',
        message: '请输入git存储地址 >',
      },
    ])
    .then(async answer => {
      const confirmMessageObj = {}
      Object.keys(answer).forEach(item => {
        confirmMessageObj[questionKeyMap[item]] = answer[item]
      })
      // 确认信息
      const confirmResult = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          default: true,
          message:
            JSON.stringify(confirmMessageObj, null, '\n') +
            '\n 确定使用以上配置?',
        },
      ])
      return {
        ...answer,
        ...confirmResult,
      }
    })
