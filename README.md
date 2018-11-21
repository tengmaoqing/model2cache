# vue-cache-data
auto save **vue.data** into localStore or memery when **vue.data** change
# Examples
- [example code](https://github.com/tengmaoqing/vue-cache-data/tree/master/example) 
- [example online](https://tengmaoqing.github.io/vue-cache-data/example/dist/)

# Usage
## registe
```javascript
import VueCacheData from 'vue-cache-data'
Vue.use(VueCacheData, options);
```

## options
#### cachePrefix
localStore cache key prefix

## config cacheKeys
```javascript
export default {
  data() {
    return {
      form: {
        text: '',
        memtext: '',
        radio: false,
        select: ''
      },
      count: 0,
      other: 'xx'
    };
  },
  // components option
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
}
```