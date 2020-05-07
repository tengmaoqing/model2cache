import { Model2Cache } from '../src/index'

describe('基本类配置', () => {
    it('options.namespace', () => {
        const form2Cache = new Model2Cache(null, {
            namespace: 'namespace',
        })
        expect(form2Cache.namespace).toBe('namespace')
    })

    it('componentsOptions.namespace', () => {
        const form2Cache = new Model2Cache(null, {
            namespace: 'test_key'
        }, {
            namespace: 'componentsOptions_namespace'
        })
        expect(form2Cache.namespace).toBe('componentsOptions_namespace')
    })
})

describe("基本功能", () => {
    it('applyData', () => {
        const model = {
            test: 1,
            form: {
                text55: 0
            }
        }
        const form2Cache = new Model2Cache(model, {
            namespace: 'applyDataTest'
        }, {
            cacheKeys: ['form.text55', 'test']
        })
        localStorage.setItem(`${form2Cache.namespace}form.text55`, JSON.stringify(6))
        localStorage.setItem(`${form2Cache.namespace}test`, JSON.stringify([1,2,3]))
        form2Cache.applyData()
        expect(model.form.text55).toBe(6)
        expect(model.test).toEqual(jasmine.objectContaining([1,2,3]))
    })
    it('watcher & clear', () => {
        let testV = 1
        let notiy = (...v:any) => null
        let destoryed = false
        const model = {
            get test () {
                return testV
            },
            set test (v:any) {
                testV = v
                if (!destoryed) {
                    notiy(v)
                }
            }
        }
        const form2Cache = new Model2Cache(model, {
            namespace: 'watcher',
            watcher (key, cb) {
                notiy = cb
                return () => {
                    destoryed = true
                }
            }
        }, {
            cacheKeys: ['test']
        })

        model.test = 2
        expect(localStorage.getItem(`${form2Cache.namespace}test`)).toBe(JSON.stringify(2))
        model.test = [1,2]
        expect(localStorage.getItem(`${form2Cache.namespace}test`)).toBe(JSON.stringify([1,2]))

        form2Cache.clear('test')
        expect(localStorage.getItem(`${form2Cache.namespace}test`)).toBeNull()

        model.test = '8'
        expect(localStorage.getItem(`${form2Cache.namespace}test`)).toBe(JSON.stringify('8'))

        form2Cache.destory()
        model.test = 3
        expect(localStorage.getItem(`${form2Cache.namespace}test`)).not.toBe(JSON.stringify(3))

        form2Cache.clear()
        expect(localStorage.getItem(`${form2Cache.namespace}test`)).toBeNull()

    })
})
