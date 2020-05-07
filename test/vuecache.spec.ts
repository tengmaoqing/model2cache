import Vue from 'vue'
import { VueCache } from '../src/index'

describe('搭配Vue使用', () => {
    it("数据变动与localStore同步", () => {
        Vue.use(VueCache, {
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
                }
            },
            cache: {
                cacheKeys: ['form.text', 'form']
            }
        })
        vm.$mount()
        vm.form.text = '4'
        vm.form.memtext = '4'
        vm.form = { text: '6', memtext: '8' }
        vm.$nextTick(() => {
            expect(vm.$model2cache.store.get(vm.$model2cache.getTruthKey('form'))).toEqual({ text: '6', memtext: '8' })
            expect(vm.$model2cache.store.get(vm.$model2cache.getTruthKey('form.text'))).toBe('6')
            expect(vm.$model2cache.store.get(vm.$model2cache.getTruthKey('form.memtext'))).toBeNull()
        })
    })
})
