# model2cache
轻量的工具库。
将数据与localstore进行绑定，适用于表单、操作状态保存等场景。 配置简单，方便使用。 

# 搭配vue
## Examples
- [示例代码](https://github.com/tengmaoqing/vue-cache-data/tree/master/example) 
- [在线代码](https://tengmaoqing.github.io/vue-cache-data/example/index.html)

## 示例代码
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

#### cacheKeys [Array]
**model**中需要与**缓存**绑定的key

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
数据缓存的命名空间
> namespace 可以有效的防止和其他缓存key重复，不同组件最好使用不同的namespace
