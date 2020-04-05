import get from 'lodash/get'
import set from 'lodash/set'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'

const DEFAULT_GLOBAL_CACHE_KEY = '__TMQ_DEFAULT_KEY__'
const DEFAULT_OPTIONS_KEY = 'cache'
const MemCache = {}

const log = (...arg) => {
  // eslint-disable-next-line no-console
  console.log('[cache-data]:', ...arg)
}

const warn = (...arg) => {
  // eslint-disable-next-line no-console
  console.warn('[cache-data]:', ...arg)
}

/**
 * 默认存储在 LocalStore，
 * 可以配置存在内存中，在 路由跳转时保存，刷新丢失。
 */

 /**
  *   new Model2Cache({
  *     namespace: '__prefix__'
  *   })
  */
export class Model2Cache {
  constructor (...args) {
    this.init(...args)
  }

  init (vm, options = {}, componentsOptions = {}) {

    this.formModel = vm
    this.$cacheOptions = componentsOptions
    if (Array.isArray(this.$cacheOptions)) {
      this.$cacheOptions = {
        cacheKeys: this.$cacheOptions || []
      }
    }
    this.$cacheOptions = {
      ...options,
      ...this.$cacheOptions
    }
    this.isdebug = this.$cacheOptions.debug
    this.cacheKeys = (this.$cacheOptions.cacheKeys || []).map(item => {
      let obj = {
        key: '',
        useLocalStore: true
      }
      if (isString(item)) {
        obj.key = item
      } else {
        Object.assign(obj, item)
      }
      return obj
    })
    this.namespace = this.$cacheOptions.namespace || DEFAULT_GLOBAL_CACHE_KEY
    this.MemCache = MemCache
    this.applyData()
    this.watchData()
  }

  getKeyConfig (key) {
    return this.cacheKeys.find(keyObj => keyObj.key === key) || {}
  }

  getLocalData (key) {
    const cachev = localStorage.getItem(`${this.namespace}${key}`)
    if (!cachev) {
      return get(this.formModel, key)
    }
    return JSON.parse(cachev)
  }

  getMemData (key) {
    return this.MemCache[key]
  }

  getData (key) {
    const { useLocalStore } = this.getKeyConfig(key)
    if (useLocalStore) {
      return this.getLocalData(key)
    }
    this.getMemData(key)
  }

  setLocalDate (key, v) {
    localStorage.setItem(`${this.namespace}${key}`, JSON.stringify(v))
  }

  setMemData (key, v) {
    this.MemCache[key] = v
  }

  setData (key, v) {
    const { useLocalStore } = this.getKeyConfig(key)
    if (useLocalStore) {
      this.setLocalDate(key, v)
      return
    }
    this.setMemData(key, v)
  }

  applyData () {
    this.cacheKeys.forEach(({ key }) => {
      const v = this.getData(key)
      this.isdebug && log('setModel', key, v)
      set(this.formModel, key, v)
    })
  }

  watchData () {
    if (!isFunction(this.$cacheOptions.watcher)) {
      this.isdebug && warn('需要提供一个 `options.watcher` 用来接收 `model` 的变化, 否则`model`的变化将不会被自动记录')
      return
    }
    this.watchs = this.cacheKeys.map(({ key }) => {
      return this.$cacheOptions.watcher(key, (nv) => {
        this.isdebug && log('watch', key, nv)
        this.setData(key, nv)
      })
    })
  }

  destory () {
    if (!this.watchs) {
      return
    }
    this.watchs.forEach(watchFn => watchFn())
  }

  deleteKey (key) {
    const { useLocalStore } = this.getKeyConfig(key)
    if (useLocalStore) {
      localStorage.removeItem(`${this.namespace}${key}`)
      return
    }
    this.MemCache[key] = null
  }

  clear (key) {
    if (key) {
      this.deleteKey(key)
      return
    }
    this.cacheKeys.map(({ key }) => {
      this.deleteKey(key)
    })
  }

  reset () {
    
  }
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
export const VueCache = {
  install (Vue, options = {}) {
    options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY
    Vue.mixin({
      mounted () {
        if (!this.$options[options.optionKey]) {
          return
        }
        this.$model2cache = new Model2Cache(this, {
          ...options,
          watcher: (key, cb) => {
            return this.$watch(key, cb)
          }
        }, this.$options[options.optionKey])
      },
      destroyed () {
        if (!this.$options[options.optionKey]) {
          return
        }
        this.$model2cache.destory()
      }
    })
  }
}
