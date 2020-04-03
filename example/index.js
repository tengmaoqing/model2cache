
/* eslint-disable */
Vue.use(VueDataCache);

const vueOpt = {
  el: '#app',
  data: {
    form: {
      text: '',
      memtext: '',
      radio: false,
      select: ''
    },
    count: 0
  },
  cache: {
    cacheKeys: [
      'form.text',
      {
        key: 'form.memtext',
        useLocalStore: false
      },
      'form.radio',
      'form.select',
      'count'
    ]
  },
  methods: {
    counter () {
      this.count += 1
    },
    reset () {
      localStorage.clear()
      this.reload()
    },
    reload () {
      location.reload()
    }
  }
}

const vm = new Vue(vueOpt);

new Vue({
  el: '#foo',
  data: {
    text: 1
  },
  cache: {
    cachePrefix: '__Tprefix__',
    cacheKeys: [
      'text'
    ]
  }
})
