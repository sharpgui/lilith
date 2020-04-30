# lilith-compiler-vue

lilith vue 编译模板

```base
.
├── README.md
├── babel.lilith.js
├── build // 编译函数存放目录，每个文件都返回一个编译函数
│   ├── build.dev.js
│   ├── build.prod.js
│   └── build.template.js
├── lib // 工具目录
│   ├── fileWatcher.js
│   ├── getPort.js
│   ├── run.js
│   └── template-hook.js
├── node_modules
├── package.json
├── public
│   ├── icon
│   │   └── favicon.ico
│   └── views
│       └── index.html
├── src // debug 调试webpack 所用文件
│   └── index.jsx
├── template // lilith run template 模式下默认集成的模板
│   ├── index.tsx
│   └── request
│       └── index.ts
├── tsconfig.json
├── webpack
│   ├── index.js
│   ├── webpack.base.config.js
│   ├── webpack.dev.config.js
│   └── webpack.prod.config.js
└── yarn.lock
```