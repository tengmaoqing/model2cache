Vue.use(VueDataCache);

const vm = new Vue({
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
  cacheKeys: [
    'form.text',
    {
      key: 'form.memtext',
      useLocalStore: false
    },
    'form.radio',
    'form.select',
    'count'
  ],
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
});

vm.$mount();
