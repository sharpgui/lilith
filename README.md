# React-Cli

**React 命令行工具，提供以下便捷功能**

+ [x] 拉取公共的仓储模版 - 拉取远程模版仓储的功能
+ [ ] 提供代码编译构建功能 - 提取目前项目中的重复的编译代码，单独的代码编译构建模块
+ [ ] 集成新版的 React 业务开发模版 - 配合后续开发的React业务开发模版
+ [ ] 集成 ditto 的业务开发模版

## Installation

全局安装cli工具

```bash 
$ npm install -g @qfe/react-cli
$ react-cli --version # 检查是否安装成功
```

如果你拉取cli工具失败，请配置[趣店registry](http://r.npmjs.qudian.com/)

```bash
$ npm install -g nrm
$ nrm add qd http://r.npmjs.qudian.com
$ nrm use qd
```

## Usage

#### 可用命令

##### react-cli create

```bash
$ react-cli create <project name> [<directory>] # 在directory目录下创建模版

# Example
$ react-cli create app-test .. # 在当前目录的上级目录创建app-test项目

# Example
$ react-cli create app-test # 在当前目录创建app-test项目
```

##### react-cli compile - 开发中命令

- [x] 支持配合当前目录中的webpack.config.js进行编译
- [ ] 支持配合当前目录中的.babelrc/babel.config.js 进行编译

```bash
$ react-cli create app-test # 创建test项目，选择模版类型
# 选择empty模版类型，该类型为开发中的react业务模版
$ cd app-test
$ react-cli compile # 结合当前目录中的webpack.config.js文件对当前目录的代码进行编译
```

##### react-cli new - 待开发命令
