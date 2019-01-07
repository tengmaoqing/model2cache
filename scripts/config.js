// const path = require('path')
const babel = require('rollup-plugin-babel')
// const alias = require('rollup-plugin-alias')
const cjs = require('rollup-plugin-commonjs')
// const replace = require('rollup-plugin-replace')
const node = require('rollup-plugin-node-resolve')
// const flow = require('rollup-plugin-flow-no-whitespace')
const version = process.env.VERSION || require('../package.json').version
// const weexVersion = process.env.WEEX_VERSION || require('../packages/weex-vue-framework/package.json').version

const banner =
  '/*!\n' +
  ` * VueDataCache.js v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} Teng Mao Qing\n` +
  ' * Released under the MIT License.\n' +
  ' */'

// const weexFactoryPlugin = {
//   intro () {
//     return 'module.exports = function weexFactory (exports, document) {'
//   },
//   outro () {
//     return '}'
//   }
// }

// const aliases = require('./alias')
// const resolve = p => {
//   const base = p.split('/')[0]
//   if (aliases[base]) {
//     return path.resolve(aliases[base], p.slice(base.length + 1))
//   } else {
//     return path.resolve(__dirname, '../', p)
//   }
// }

const builds = {
  'web-compiler-browser': {
    entry: 'src/index.js',
    dest: 'dist/VueDataCache.umd.js',
    format: 'umd',
    env: 'development',
    moduleName: 'VueDataCache',
    // external: ['lodash/set', 'lodash/get'],
    plugins: [node(), cjs()],
    banner
  },
  'web-compiler-browser-prod': {
    entry: 'src/index.js',
    dest: 'dist/VueDataCache.umd.min.js',
    format: 'umd',
    env: 'development',
    moduleName: 'VueDataCache',
    // external: ['lodash/set', 'lodash/get'],
    plugins: [node(), cjs()],
    banner
  },
  'web-compiler': {
    entry: 'src/index.js',
    dest: 'dist/VueDataCache.common.js',
    format: 'cjs',
    external: ['lodash/set', 'lodash/get'],
    // external: Object.keys(require('../packages/vue-template-compiler/package.json').dependencies),
    banner
  },
  'web-esm': {
    entry: 'src/index.js',
    dest: 'dist/VueDataCache.esm.js',
    format: 'es',
    external: ['lodash/set', 'lodash/get'],
    banner
  },
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      babel(),
      // alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'VueDataCache'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // if (opts.env) {
  //   config.plugins.push(replace({
  //     'process.env.NODE_ENV': JSON.stringify(opts.env)
  //   }))
  // }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}