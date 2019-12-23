# Lilith

- 一个页面模板构建工具，并且模板可以独立运行（类似 umi block）；
- 一个零配置webpack编译工具（类似 create-react-app）,提供 react 和 vue 的两种编译方式，默认为 react 编译模式；；

## Table of contents

- [Lilith](#lilith)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [命令介绍](#%e5%91%bd%e4%bb%a4%e4%bb%8b%e7%bb%8d)
    - [Create](#create)
    - [Run](#run)
    - [New](#new)
  - [关于 template 模式](#%e5%85%b3%e4%ba%8e-template-%e6%a8%a1%e5%bc%8f)
  - [自定义配置](#%e8%87%aa%e5%ae%9a%e4%b9%89%e9%85%8d%e7%bd%ae)
  - [exmaple](#exmaple)
  - [CLI usage](#cli-usage)
  
## Getting started

install lilith

```bash
$ npm install @qfed/lilith -g
```

## 命令介绍

### Create

lilith 创建命令，根据命令提示创建项目脚手架或者`lilith template`

`$ lilith create <name>`


### Run 

编译命令零配置运行现有项目

`$ run <mode> [source]` 

- `<mode>` 编译模式现在支持三种模式 `dev`（webpack dev server模板）； `build`（webpack production 模式） `template`（lilith template 模式，配合 new 命令使用）；
- `[source]` 编译源默为`@qfed/lilith-compiler` 支持 `react` 与 `typescript` ，现提供两种编译源 `react` 与 `vue` `npm run dev` 即编译 `react` 项目， `npm run dev vue` 即编译 `vue` 项目，`[source]` 也可以是符合 Lilith 编译规范自定义源；

example:

- `$ lilith run dev`
- `$ lilith run dev vue`
- `$ lilith run build`
- `$ lilith run template`



### New

模板创建命令根据现有模板创建新页面,默认在当前项目的根目录下的`_template`目录，获取项目模板[更多用法详见](https://github.com/advence-liz/quickly-template)；

`$ lilith new <template> <name> [target]`

- `$ lilith new page new-page` 以page为模板创建一下新模块new-page并输出到当前目录；
- `$ lilith new pa new-page` 同样是以page为模板创建一下新模块new-page并输出到当前目录，因为template支持简写形式，简写只要满足startsWith就会认为其相等的；
- `$ lilith new page new-page pages` 以page为模板创建一下新模块new-page并输出到pages目录；

## 关于 template 模式

Lilith 不仅是零配置 webpack 运行工具，同时也是模板生成工具，并且生成的模板可以独立运行，lilith template 中包含以下功能；
  - 编译运行模版语法
  - 注入略加封装的Request工具
  - Mock服务
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

  },
  // 自定义编译源
  compiler: {
    react: '@qfed/lilith-compiler'
    vue:'@qfed/lilith-compiler-vue'
  }
}
```

## exmaple

- `example/lilith-tempate` lilith 模板 demo；
- `example/overwrite-webpack-config` lilith 重写 webpack demo；
- `example/vue` lilith vue 编译 demo；
- `example/lilith-template-vue` lilith 模板 vue demo；


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
  --source <string>               编译源默认值 @qfed/lilith-compiler (default: "@qfed/lilith-compiler")
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
