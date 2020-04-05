# model2cache
轻量的工具库

将数据与localstore进行绑定，适用于表单、操作状态保存等场景。 配置简单，使用方便。 

# 搭配vue
## Examples
- [示例代码](https://github.com/tengmaoqing/model2cache/tree/master/example) 
- [在线示例](https://tengmaoqing.github.io/model2cache/example/index.html)

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

## method

#### clear

```javascript
const vm = new Vue(opt)
vm.$model2cache.clear('cacheKey')
```
清除传入的 cacheKey对应的localstore。

如果不传参数，则清除 cacheKeys 中配置的所有keys对应的localstore。
