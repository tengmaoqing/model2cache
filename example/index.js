
/* eslint-disable */
Vue.use(Model2Cache.VueCache);
Vue.use(Vuetify)

const Namespace1 = {
  template: `<v-text-field v-model="text" label="作用域1里的text"></v-text-field>`,
  data () {
    return {
      text: ''
    }
  },
  cache: {
    namespace: 'namespace1',
    cacheKeys: [
      'text'
    ]
  }
}

const Namespace2 = {
  template: `<v-text-field v-model="text" label="作用域2里的text"></v-text-field>`,
  data () {
    return {
      text: ''
    }
  },
  cache: {
    namespace: 'namespace2',
    cacheKeys: [
      'text'
    ]
  }
}

const vueOpt = {
  el: '#app',
  vuetify: new Vuetify(),
  components: {
    Namespace1,
    Namespace2
  },
  data: {
    tab: 0,
    form: {
      text: '',
      number: 1,
      memtext: '',
      checkbox: false,
      selected: []
    },
    cleared: false
  },
  cache: {
    cacheKeys: [
      'form.text',
      {
        key: 'form.memtext',
        useLocalStore: false
      },
      'form.number',
      'form.checkbox',
      'form.selected',
      'tab'
    ]
  },
  methods: {
    reset () {
      this.$model2cache.clear()
      this.cleared = true
    },
    reloadPage () {
      location.reload()
    }
  }
}

new Vue(vueOpt)
