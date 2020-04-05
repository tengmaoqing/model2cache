/*!
 * Model2Cache.js v1.0.0
 * (c) 2019-2020 Teng Mao Qing
 * Released under the MIT License.
 */
import get from 'lodash/get';
import set from 'lodash/set';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

const warn = function warn() {
  for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    arg[_key2] = arguments[_key2];
  }

  // eslint-disable-next-line no-console
  console.warn('[cache-data]:', ...arg);
};
/**
 * 默认存储在 LocalStore，
 * 可以配置存在内存中，在 路由跳转时保存，刷新丢失。
 */

/**
 *   new Model2Cache({
 *     namespace: '__prefix__'
 *   })
 */


class Model2Cache {
  constructor() {
    this.init(...arguments);
  }

  init(vm) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let componentsOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.formModel = vm;
    this.$cacheOptions = componentsOptions;

    if (Array.isArray(this.$cacheOptions)) {
      this.$cacheOptions = {
        cacheKeys: this.$cacheOptions || []
      };
    }

    this.$cacheOptions = _objectSpread2({}, options, {}, this.$cacheOptions);
    this.isdebug = this.$cacheOptions.debug;
    this.cacheKeys = (this.$cacheOptions.cacheKeys || []).map(item => {
      let obj = {
        key: '',
        useLocalStore: true
      };

      if (isString(item)) {
        obj.key = item;
      } else {
        Object.assign(obj, item);
      }

      return obj;
    });
    this.namespace = this.$cacheOptions.namespace || DEFAULT_GLOBAL_CACHE_KEY;
    this.MemCache = MemCache;
    this.applyData();
    this.watchData();
  }

  getKeyConfig(key) {
    return this.cacheKeys.find(keyObj => keyObj.key === key) || {};
  }

  getLocalData(key) {
    const cachev = localStorage.getItem("".concat(this.namespace).concat(key));

    if (!cachev) {
      return get(this.formModel, key);
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
    localStorage.setItem("".concat(this.namespace).concat(key), JSON.stringify(v));
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
      this.isdebug && log('setModel', key, v);
      set(this.formModel, key, v);
    });
  }

  watchData() {
    if (!isFunction(this.$cacheOptions.watcher)) {
      this.isdebug && warn('需要提供一个 `options.watcher` 用来接收 `model` 的变化, 否则`model`的变化将不会被自动记录');
      return;
    }

    this.watchs = this.cacheKeys.map((_ref2) => {
      let {
        key
      } = _ref2;
      return this.$cacheOptions.watcher(key, nv => {
        this.isdebug && log('watch', key, nv);
        this.setData(key, nv);
      });
    });
  }

  destory() {
    if (!this.watchs) {
      return;
    }

    this.watchs.forEach(watchFn => watchFn());
  }

  deleteKey(key) {
    const {
      useLocalStore
    } = this.getKeyConfig(key);

    if (useLocalStore) {
      localStorage.removeItem("".concat(this.namespace).concat(key));
      return;
    }

    this.MemCache[key] = null;
  }

  clear(key) {
    if (key) {
      this.deleteKey(key);
      return;
    }

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
 *      namespace: '__prefix__'
 *    }
 *  }
 */

const VueCache = {
  install(Vue) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY;
    Vue.mixin({
      mounted() {
        if (!this.$options[options.optionKey]) {
          return;
        }

        this.$model2cache = new Model2Cache(this, _objectSpread2({}, options, {
          watcher: (key, cb) => {
            return this.$watch(key, cb);
          }
        }), this.$options[options.optionKey]);
      },

      destroyed() {
        if (!this.$options[options.optionKey]) {
          return;
        }

        this.$model2cache.destory();
      }

    });
  }

};

export { Model2Cache, VueCache };
