// Karma configuration
// Generated on Fri Feb 07 2020 15:05:47 GMT+0800 (中国标准时间)
// const webpack = require('webpack')

const webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
  ],
  devtool: '#inline-source-map'
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: './**/*.spec.js', watched: false }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    
    preprocessors: {
      './**/*.spec.js': ['webpack']
    },
    webpack: webpackConfig,
    // plugins: [
    //   'karma-jasmine',
    //   'karma-webpack',
    //   'karma-chrome-launcher'
    // ],
    // rollupPreprocessor: {
    //   plugins: [node(), cjs()],
    //   output: {
    //       format: 'iife', // Helps prevent naming collisions.
    //       name: 'Krama_Test', // Required for 'iife' format.
    //       sourcemap: 'inline', // Sensible for testing.
    //   },
    // },
    // customPreprocessors: {
    //   rollupBabel: {
    //     base: 'rollup',
    //     options: {
    //         plugins: [babel()],
    //     },
    //   },
    // },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
