/*!
 * VueDataCache.js v0.1.4
 * (c) 2014-2020 Teng Mao Qing
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var get = _interopDefault(require('lodash/get'));
var set = _interopDefault(require('lodash/set'));

const DEFAULT_GLOBAL_CACHE_KEY = '__TMQ_DEFAULT_KEY__';
const DEFAULT_OPTIONS_KEY = 'cache';
const MemCache = {};

const log = function log() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  // eslint-disable-next-line no-console
  console.log('[cache-data]:', ...arg);
};
/**
 * 默认存储在 LocalStore，
 * 可以配置存在内存中，在 路由跳转时保存，刷新丢失。
 */

/**
 *   new AutoSaveForm({
 *     cachePrefix: '__prefix__'
 *   })
 */


class AutoSaveForm {
  constructor() {
    this.init(...arguments);
  }

  init(vm) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.isdebug = options.debug;
    this.vm = vm;
    this.$cacheOptions = vm.$options[options.optionKey]; // this.installStatic(vm)

    if (Array.isArray(this.$cacheOptions)) {
      this.$cacheOptions = {
        cacheKeys: this.$cacheOptions || []
      };
    }

    this.cacheKeys = this.$cacheOptions.cacheKeys.map(item => {
      let obj = {
        key: '',
        useLocalStore: true
      };

      if (typeof item === 'string') {
        obj.key = item;
      } else {
        Object.assign(obj, item);
      }

      return obj;
    }) || [];
    this.cachePrefix = this.$cacheOptions.cachePrefix || options.cachePrefix || DEFAULT_GLOBAL_CACHE_KEY;
    this.MemCache = MemCache;
  } // installStatic (vm) {
  //   vm.$options.aaa = '22'
  // }


  getKeyConfig(key) {
    return this.cacheKeys.find(keyObj => keyObj.key === key) || {};
  }

  getLocalData(key) {
    const cachev = localStorage.getItem("".concat(this.cachePrefix).concat(key));

    if (!cachev) {
      return get(this.vm, key);
    }

    return JSON.parse(cachev);
  }

  getMemData(key) {
    return this.MemCache[key];
  }

  getData(key) {
    const {
      useLocalStore
    } = this.getKeyConfig(key);

    if (useLocalStore) {
      return this.getLocalData(key);
    }

    this.getMemData(key);
  }

  setLocalDate(key, v) {
    localStorage.setItem("".concat(this.cachePrefix).concat(key), JSON.stringify(v));
  }

  setMemData(key, v) {
    this.MemCache[key] = v;
  }

  setData(key, v) {
    const {
      useLocalStore
    } = this.getKeyConfig(key);

    if (useLocalStore) {
      this.setLocalDate(key, v);
      return;
    }

    this.setMemData(key, v);
  }

  applyData() {
    this.cacheKeys.forEach((_ref) => {
      let {
        key
      } = _ref;
      const v = this.getData(key);
      set(this.vm, key, v);
    });
  }

  watchData() {
    this.watchs = this.cacheKeys.map((_ref2) => {
      let {
        key
      } = _ref2;
      return this.vm.$watch(key, nv => {
        this.isdebug && log('watch', key, nv);
        this.setData(key, nv);
      });
    });
  }

  destory() {
    this.watchs.forEach(watchFn => watchFn());
  }

  deleteKey(key) {
    const {
      useLocalStore
    } = this.getKeyConfig(key);

    if (useLocalStore) {
      localStorage.removeItem("".concat(this.cachePrefix).concat(key));
      return;
    }

    this.MemCache[key] = null;
  }

  clear() {
    this.cacheKeys.map((_ref3) => {
      let {
        key
      } = _ref3;
      this.deleteKey(key);
    });
  }

  reset() {}

}
/**
 *  components Config / key config / global config
 * 
 *  export default {
 *    cache: ['key', 'data.key'],
 *    cache: {
 *      cacheKeys: ['key', 'data.key', {
 *        key: 'otherKey',
          useLocalStore: false
 *      }],
 *      cachePrefix: '__prefix__'
 *    }
 *  }
 */


const AutoSaveFormForVue = {
  install(Vue) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY;
    Vue.mixin({
      mounted() {
        if (!this.$options[options.optionKey]) {
          return;
        }

        this.$autoSave = new AutoSaveForm(this, options);
        this.$autoSave.applyData();
        this.$autoSave.watchData();
      },

      destroyed() {
        if (!this.$options[options.optionKey]) {
          return;
        }

        this.$autoSave.destory();
      }

    });
  }

};

module.exports = AutoSaveFormForVue;
