import { Model2Cache, Options } from './model2cache'
import { VueConstructor } from 'vue/types/vue'

const DEFAULT_OPTIONS_KEY = 'cache'

interface VueOptions extends Options {
    optionKey?: string
}

export const VueCache = {
    install (Vue: VueConstructor, options:VueOptions = {}) {
        options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY
        Vue.mixin({
            mounted () {
                if (!this.$options[options.optionKey]) {
                    return
                }
                this.$model2cache = new Model2Cache(this, {
                    ...options,
                    watcher: (key: string, cb: (v:any) => any) => {
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
