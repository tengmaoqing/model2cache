# model2cache
bind **model** with localStore or memery
# Examples
- [example code](https://github.com/tengmaoqing/vue-cache-data/tree/master/example) 
- [example online](https://tengmaoqing.github.io/vue-cache-data/example/index.html)

# Usage with Vue
## registe
```javascript
import { VueCache } from 'model2cahce'
Vue.use(VueCache, options);

// in component
{
  data () {
    return {
      someKey: 1,
      form: {
        name: 'tm'
      }
    }
  },
  ...otherVueOptions,
  // inject model2cahce options
  cache: {
    cacheKeys: ['form.name']
  }
}
```

## options

#### cacheKeys
model keys need to bind

```javascript
export default {
  data() {
    return {
      form: {
        text: '',
        memtext: 8
        select: []
      },
      count: 0,
    };
  },
  cache: {
    cachePrefix: 'cache_in_vue',
    cacheKeys: [
      'form.text',
      {
        key: 'form.memtext',
        useLocalStore: false
      },
      'form.select',
      'count'
    ]
  }
}
```

#### namespace [String]
namespace of cache
