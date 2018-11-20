/* eslint-disable */
import VueCacheData from '../dist/vueFormCache.common.js'
import Vue from 'vue'
import App from './tp.vue'

Vue.use(VueCacheData);

new Vue({
  el: '#app',
  render(h) {
    return h(App)
  }
});
