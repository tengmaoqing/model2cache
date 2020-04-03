
import Vue from 'vue'
import VueDataCache, { Form2Cache } from '../src/index'

describe('基本类配置', () => {
    it('options.cachePrefix', () => {
        const form2Cache = new Form2Cache(null, {
            cachePrefix: 'cachePrefix',
        })
        expect(form2Cache.cachePrefix).toBe('cachePrefix')
    })

    it('componentsOptions.cachePrefix', () => {
        const form2Cache = new Form2Cache(null, {
            cachePrefix: 'test_key'
        }, {
            cachePrefix: 'componentsOptions_cachePrefix'
        })
        expect(form2Cache.cachePrefix).toBe('componentsOptions_cachePrefix')
    })
})

describe("基本功能", () => {
    it("刷新后获取数据", () => {
        Vue.use(VueDataCache, {
            debug: true
        })
        const vm = new Vue({
            render (h) {
                return h('div')
            },
            data: {
                form: {
                    text: '3',
                    memtext: '3'
                },
                count: 0
            },
            cache: {
                cacheKeys: ['form.text']
            }
        })
        vm.$mount()
        if (window.sessionStorage.loaded) {
            expect(vm.form.text).toBe('4')
            expect(vm.form.memtext).toBe('3')
            return
        }
        vm.form.text = '4'
        vm.form.memtext = '4'
        expect(vm.form.text).toBe('4')
        expect(vm.form.memtext).toBe('3')
        window.sessionStorage.loaded = true
        window.location.reload()
    })
})
