// const path = require('path');

const vueConfig = {
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  vueConfig.outputDir = 'example/dist'
  vueConfig.baseUrl = './'
  vueConfig.chainWebpack = config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].template = './example/index.html'
        return args
      })
  }
  vueConfig.configureWebpack =  config => {
    config.entry = './example/index.js'
    // config.optimization.minimize = false
    config.resolve.symlinks = false
    // console.log(config.resolve.symlinks)
  }
}


module.exports = vueConfig