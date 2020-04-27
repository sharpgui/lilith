# Lilith

命令行工具：1. 零配置编译react & vue （类似creat-react-app)2. 便捷的创建页面模板(类似umiblock）；

## 提供的功能

- 零配置webpack编译，支持React与Vue两种编译方式（默认Reac编译模式）
- 支持TypeScript
- 模板构建
- 独立运行模板

## 目录

 - [Getting started](#getting-started)
   - [命令](#命令)
    - [run](#run)
    - [compile](#compile)
    - [create](#create)
    - [new](#new)
  - [关于模板](#关于模板)
  - [自定义配置](#自定义配置)
  - [示例](#示例)
  - [CLI usage](#cli-usage)
  
## Getting started

install lilith

```bash
$ npm install lilith-cli -g
```

假设项目目录结构如下,`$ lilith run dev` 将自动以`./src/index`作为入口启动 `webpack devserver`;

```bash
├── README.md
├── lilith.config.js
├── mock
│   └── api.json
├── package.json
├── src
│   └── index.tsx
└── yarn.lock
```

## 命令

### run

编译命令零配置运行现有项目，默认打包入口为`./src/index`；

`$ run <mode> [source]` 

- `<mode>` 编译模式现在支持三种模式 `dev`（webpack dev server模板）； `build`（webpack production 模式） `template`（lilith template 模式，配合 new 命令使用）；
- `[source]` 编译源，可以直接使用 `react` 或 `vue`；也可以是符合 Lilith 编译规范自定义源，默为`@qfed/lilith-compiler`，

示例:

- `$ lilith run dev`
- `$ lilith run dev vue`
- `$ lilith run build`
- `$ lilith run template`

### compile

lilith 编译命令，可以编译单文件（类似vue-cli）

`lilith compile index.tsx`

### create

lilith 创建命令，根据命令提示，创建项目脚手架或者项目模板

`$ lilith create <name>`
- `<name>` 项目名称

示例:

- `$ lilith create sample`

### new

根据模板创建新页面，模板默认目录：当前项目的根目录下的`_template`目录，获取项目模板[更多用法详见](https://github.com/advence-liz/quickly-template)；

`$ lilith new <template> <name> [target]`

- `<template>` 模板页面，支持简写（需满足startsWith）
- `<name>` 新页面名称
- `[target]` 新页面输出目录，默认`process.cwd()`

示例:

- `$ lilith new page new-page` 以page为模板，创建一个新页面new-page，并输出到当前目录；
- `$ lilith new pa new-page` 与上面命令功能相同，template支持简写形式，简写只要满足startsWith就会认为其相等的；
- `$ lilith new page new-page pages` 以page为模板，创建一个新页面new-page，并输出到pages目录；



## 关于模板

Lilith 不仅是零配置 webpack 运行工具，同时也是模板生成工具，且生成的模板可以独立运行，lilith template 中包含以下功能；
  - 编译运行模版语法
  - 注入略加封装的Request工具
  - Mock服务[了解更多-json-server-router](https://github.com/advence-liz/json-server-router)
  - 配合 lilith new 命令智能生成模版页面

```bash
# 全局安装lilith命令行工具
$ npm i -g @qfed/lilith 

# 创建开发模版的模版
$ lilith create template <templateName> 

# 进入生成目录
$ cd _template/<template name>

# 运行启动
$ npm install && npm run dev
```

[了解更多-模板开发说明](./packages/lilith-cli/_template/template/README.md)


## 自定义配置

lilith 可以通过配置 lilith.config.js 文件，定制化模版编译的内容及源，

```javascript
module.exports = {
  // 自定义webpack配置
  webpack: {
    entry: './src/'
  },
  // 自定义编译源
  compiler: {
    react: 'lilith-compiler'
    vue:'lilith-compiler-vue'
  }
}
```

## 示例
- [example/lilith-single-file](./example/lilith-single-file)lilith编译单文件；
- [example/lilith-tempate](./example/lilith-template-react/) lilith 编译 React 模板demo；
- [example/overwrite-webpack-config](./example/overwrite-webpack-config/) lilith 重写 webpack demo；
- [example/vue](./example/vue/) lilith vue编译 demo；
- [example/lilith-template-vue](./example/lilith-template-vue/) lilith 编译 vue 模板 demo；


## CLI usage

```bash
Usage: lilith [options] [command]

Options:
  -v, --version                   version
  --root <string>                 模板所在根目录,相对目录,基于context来获取root的绝对路径，默认值"_template" (default: "_template")
  --context <string>              lilith.config.js文件所在目录 > 优先级package.json所在目录 > process.cwd() (default: process.cwd())
  --target <string>               新生成模块的输出路径，相对process.cwd(),默认"." (default: ".")
  --template <string>             当前使用的模板，模板可选范围即root下面指定的模板，支持简写即当前有模板page那么p,pa,pag等效
  --name <string>                 新生成模块的名称
  --mode <string>                 编译模式 template dev build (default: "dev")
  --source <string>               编译源默认值 lilith-compiler (default: "lilith-compiler")
  --type <string>                 创建的模版类型
  -h, --help                      output usage information

Commands:
  new <template> <name> [target]  lilith 模板创建命令
  run <mode> [source]             lilith 编译命令
  create [<templateName>]         lilith 创建命令，根据提示可以创建项目脚手架或者lilith模板

Examples:
  $ lilith run dev
  $ lilith run build
  $ lilith run dev vue
  $ lilith run build vue
  $ lilith new template someTemplate
```  
