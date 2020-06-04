# 模版开发说明

## 简介
**本模版是基于 [lilith](https://github.com/qfed/lilith) 命令行工具，配套生成开发模版页面的模版，包含以下功能**
  * 编译运行模版语法
  * 注入略加封装的Request工具
  * Mock服务
  * 配合 lilith new 命令智能生成模版页面

## 运行方式
```bash

# 创建开发模版的模版
$ lilith create template <template name>

# 进入生成目录
$ cd _template/<template name>

# 运行启动
$ npm install && npm run dev
```

访问 `https://localhost:${port}`开始模版开发！

## 目录结构
**创建命令会自动把模版开发文件放到_template目录下**
```javascript
|———— _template
|     |———— template_name
|     |     |———— mock
|     |     |———— src
|     |     |     |———— services
|     |     |     |———— index
|     |     |———— .gitignore
|     |     |———— package.json
|     |     |———— README.md
|     |     |———— yarn.lock
```

## 模版语法

模版使用 [art_template](https://github.com/aui/art-template) 编译，并且扩充了`__name_pascal__`形式以规避 IDE 解析语法报错。

#### 编译前

```javascript
class  __name_pascal__{
  'hi, {{name}}'
  'hi, {{name|pascal}}'
  'hi, __name_pascal__'
  'hi, {{dirname|pascal}}'

}
```

#### 编译后
```javascript
class NewPage {
  'hi, newPage'
  'hi, NewPage'
  'hi, NewPage'
  'hi, NewPage'
}
```

## Mock服务

**Mock服务使用 [json-server-router](https://github.com/advence-liz/json-server-router)**

## 自定义配置

* 如果需要定制化模版编译的内容及源，请配合 lilith 编译工具，配置 lilith.config.js 文件

```javascript
module.exports = {
  // 自定义webpack配置
  webpack: {

  },
}
```
## 内置工具

* Request 会在模版创建时，由 lilith-compiler 携带到模版仓储中
