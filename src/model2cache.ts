// import * as _ from 'lodash'
import set from 'lodash-es/set'
// import isString from 'lodash/isString'
import isFunction from 'lodash-es/isFunction'
// import { set, isFunction } from 'lodash'
import { Store, StoreType } from './cache'

// const { set, isString, isFunction } = _

const DEFAULT_GLOBAL_CACHE_KEY = '__TMQ_DEFAULT_KEY__'

const log = (...arg) => {
  // eslint-disable-next-line no-console
  console.log('[cache-data]:', ...arg)
}

const warn = (...arg) => {
  // eslint-disable-next-line no-console
  console.warn('[cache-data]:', ...arg)
}

interface watcherFn {
    (key: string, cb:(nv: any) => void): any
}

interface CacheKeys {
    [prop: string]: any
}

export interface Options {
    cacheKeys?: CacheKeys;
    debug?: boolean;
    watcher?: watcherFn;
    namespace?: string;
}

export class Model2Cache {
    formModel: object
    $cacheOptions: Options
    isdebug: boolean
    cacheKeys: CacheKeys
    namespace: string
    storeType: StoreType = StoreType.localStorage
    store: Store
    watchs: (() => void)[]
    constructor (...arg: any[]) {
        this.init(...arg)
    }

    init (formModel = [], options: Options = {}, componentsOptions = {}) {
        this.formModel = formModel
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
        this.cacheKeys = (this.$cacheOptions.cacheKeys || []).map((item: string | Object) => {
            const obj = {
                key: '',
                useLocalStore: true
            }
            if (typeof item === 'string') {
                obj.key = item
            } else {
                Object.assign(obj, item)
            }
            return obj
        })

        this.namespace = this.$cacheOptions.namespace || DEFAULT_GLOBAL_CACHE_KEY
        this.store = new Store(null, this.storeType)
        this.applyData()
        this.watchData()
    }

    getTruthKey (key: string) {
        return `${this.namespace}${key}`
    }

    applyData () {
        this.cacheKeys.forEach(({ key }) => {
            const v = this.store.get(this.getTruthKey(key))
            if (!v) {
                return
            }
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
              this.store.set(this.getTruthKey(key), nv)
            })
        })
    }

    destory () {
        if (!this.watchs) {
            return
        }
        this.watchs.forEach(watchFn => watchFn())
    }

    deleteKey (key: string) {
        this.store.delete(this.getTruthKey(key))
    }

    clear (key?: string) {
        if (key) {
            this.deleteKey(key)
            return
        }
        this.cacheKeys.map(({ key }) => {
            this.deleteKey(key)
        })
    }
}
