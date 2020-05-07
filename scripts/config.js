const babel = require('rollup-plugin-babel')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const pkg = require('../package.json')
const version = process.env.VERSION || pkg.version
const typescript = require('rollup-plugin-typescript2')
const DEFAULT_EXTENSIONS = require('@babel/core').DEFAULT_EXTENSIONS

const banner =
  '/*!\n' +
  ` * Model2Cache.js v${version}\n` +
  ` * (c) 2019-${new Date().getFullYear()} Teng Mao Qing\n` +
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
    entry: 'src/index.ts',
    dest: `dist/${pkg.name}.umd.js`,
    format: 'umd',
    env: 'development',
    moduleName: 'Model2Cache',
    plugins: [node(), cjs()],
    banner
  },
  'web-compiler-browser-prod': {
    entry: 'src/index.ts',
    dest: `dist/${pkg.name}.umd.min.js`,
    format: 'umd',
    moduleName: 'Model2Cache',
    plugins: [node(), cjs()],
    banner
  },
  'web-compiler': {
    entry: 'src/index.ts',
    dest: `dist/${pkg.name}.common.js`,
    format: 'cjs',
    external: ['lodash-es/set', 'lodash-es/isFunction'],
    // external: Object.keys(require('../packages/vue-template-compiler/package.json').dependencies),
    banner
  },
  'web-esm': {
    entry: 'src/index.ts',
    dest: `dist/${pkg.name}.esm.js`,
    format: 'es',
    external: ['lodash-es/set', 'lodash-es/isFunction'],
    banner
  },
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
      babel({
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts'
        ]
      }),
      // alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []).concat([
      
    ]),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Model2Cache'
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