import get from 'lodash/get';
import set from 'lodash/set';

const DEFAULT_CACHE_KEY = '__TMQ_DEFAULT_KEY__';
const MemCache = {};

/**
 * 默认存储在 LocalStore，
 * 可以配置存在内存中，在 路由跳转时保存，刷新丢失。
 */
class AutoSaveForm {
  constructor (...args) {
    this.init(...args);
  }

  init (vm, options = {}) {
    this.vm = vm;
    this.cacheKeys = vm.$options.cacheKeys.map(item => {
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
    this.cachePrefix = options.cachePrefix || DEFAULT_CACHE_KEY;
    this.MemCache = MemCache;
  }

  getLocalDate (key) {
    const cachev = localStorage.getItem(`${this.cachePrefix}${key}`);
    if (!cachev) {
      return get(this.vm, key);
    }
    return JSON.parse(cachev);
  }

  getMemData (key) {
    return this.MemCache[key];
  }

  setLocalDate (key, v) {
    localStorage.setItem(`${this.cachePrefix}${key}`, JSON.stringify(v));
  }

  setMemData (key, v) {
    this.MemCache[key] = v;
  }

  applyData () {
    this.cacheKeys.forEach(({ key, useLocalStore }) => {
      let v = '';
      if (useLocalStore) {
        v = this.getLocalDate(key);
      } else {
        v = this.getMemData(key);
      }
      set(this.vm, key, v);
    });
  }

  watchData () {
    this.watchs = this.cacheKeys.map(({ key, useLocalStore }) => {
      return this.vm.$watch(key, (nv) => {
        if (useLocalStore) {
          this.setLocalDate(key, nv);
          return;
        }
        this.setMemData(key, nv);
      });
    });
  }

  destory () {
    this.watchs.forEach(watchFn => watchFn());
  }

  reset () {
    
  }
}

const AutoSaveFormForVue = {
  install (Vue, options) {
    Vue.mixin({
      mounted () {
        if (!this.$options.cacheKeys) {
          return;
        }
        this.$autoSave = new AutoSaveForm(this, options);
        this.$autoSave.applyData();
        this.$autoSave.watchData();
      },
      destroyed () {
        if (!this.$options.cacheKeys) {
          return;
        }
        this.$autoSave.destory();
      }
    });
  }
};

export default AutoSaveFormForVue;
