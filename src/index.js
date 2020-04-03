import get from 'lodash/get'
import set from 'lodash/set'
import isString from 'lodash/isString'

const DEFAULT_GLOBAL_CACHE_KEY = '__TMQ_DEFAULT_KEY__'
const DEFAULT_OPTIONS_KEY = 'cache'
const MemCache = {}

const log = (...arg) => {
  // eslint-disable-next-line no-console
  console.log('[cache-data]:', ...arg)
}

/**
 * 默认存储在 LocalStore，
 * 可以配置存在内存中，在 路由跳转时保存，刷新丢失。
 */

 /**
  *   new Form2Cache({
  *     cachePrefix: '__prefix__'
  *   })
  */
export class Form2Cache {
  constructor (...args) {
    this.init(...args)
  }

  init (vm, options = {}, componentsOptions = {}) {

    this.isdebug = options.debug
    this.formModel = vm
    this.$cacheOptions = componentsOptions
    if (Array.isArray(this.$cacheOptions)) {
      this.$cacheOptions = {
        cacheKeys: this.$cacheOptions || []
      }
    }
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
    this.cachePrefix = this.$cacheOptions.cachePrefix || options.cachePrefix || DEFAULT_GLOBAL_CACHE_KEY
    this.MemCache = MemCache
  }

  getKeyConfig (key) {
    return this.cacheKeys.find(keyObj => keyObj.key === key) || {}
  }

  getLocalData (key) {
    const cachev = localStorage.getItem(`${this.cachePrefix}${key}`)
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
    localStorage.setItem(`${this.cachePrefix}${key}`, JSON.stringify(v))
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
      set(this.formModel, key, v)
    })
  }

  watchData () {
    this.watchs = this.cacheKeys.map(({ key }) => {
      return this.formModel.$watch(key, (nv) => {
        this.isdebug && log('watch', key, nv)
        this.setData(key, nv)
      })
    })
  }

  destory () {
    this.watchs.forEach(watchFn => watchFn())
  }

  deleteKey (key) {
    const { useLocalStore } = this.getKeyConfig(key)
    if (useLocalStore) {
      localStorage.removeItem(`${this.cachePrefix}${key}`)
      return
    }
    this.MemCache[key] = null
  }

  clear () {
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
 *      cachePrefix: '__prefix__'
 *    }
 *  }
 */
const Form2CacheForVue = {
  install (Vue, options = {}) {
    options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY
    Vue.mixin({
      mounted () {
        if (!this.$options[options.optionKey]) {
          return
        }
        this.$autoSave = new Form2Cache(this, options, this.$options[options.optionKey])
        this.$autoSave.applyData()
        this.$autoSave.watchData()
      },
      destroyed () {
        if (!this.$options[options.optionKey]) {
          return
        }
        this.$autoSave.destory()
      }
    })
  }
}

export default Form2CacheForVue
