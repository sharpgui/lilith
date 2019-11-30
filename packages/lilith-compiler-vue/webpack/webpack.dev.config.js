const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
module.exports = merge(baseConfig, {
  output: {
    hotUpdateChunkFilename: 'hot-update-chunk.js',
    hotUpdateMainFilename: 'hot-main.js',
  },
})
