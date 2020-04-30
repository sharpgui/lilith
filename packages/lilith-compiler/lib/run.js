/**
 * 工具函数用于根据路径执行 build.dev.js 中的编译函数
 */
const path = require('path')
const [, , type] = process.argv

const run = require(path.resolve(process.cwd(), 'build', `build.${type}.js`))
run({})

// // 打印 process.argv。
// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
//   });
//   启动 Node.js 进程：

//   $ node process-args.js one two=three four
//   输出如下：

//   0: /usr/local/bin/node
//   1: /Users/mjr/work/node/process-args.js
//   2: one
//   3: two=three
//   4: four
