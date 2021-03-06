
### is

`function(tar: unknown) {if (typeof tar === 'string') {return tar.toUpperCase()}}`会报警告的，因为TS还是不知道tar是啥

`function isString(tar: unknown): tar is string {return typeof tar === 'string'}; if (isString(tar)) {return tar.toUpperCase()}`则不会报错，这种类型判断函数还是很有用的

### & |

`type C = A & B` C必须同时满足A和B

`type C = A | B` C只需要满足A或者B中的一个即可，但是不能逾越A & B

### Vue3.0 Proxy

Vue2.0中通过defineProperty，每个属性都要监听，proxy只需要监听一次即可

如果一个对象有4层，每一层都是一个对象：

Vue2.0需要执行3^4 = 81次  
Vue3.0需要执行3^3 = 27次

Vue3.0除了shallow监听之外，引入了readonly监听，这样其后代不会被监听到了，又优化了一波性能

Vue3.0只有在Get到对应属性时才添加绑定，比如访问`a.b.c.d`的时候会自动添加三层监听，应对大量数据性能提升大

```js
a = {
  b: {
    c: {
      d: {
        e: {
          f: 1
        }
        ...
      }
      ...
    }
    ...
  }
  ...
}

defineReactive(a)
```

### Ref和Effect

Effect --- 影响，可以理解为一个值发生变化后要做的事，相当于2.0 watcher的cb

Effect存在Dep中，Dep是一个Set数据结构，存放所有关联的Effect

track()方法是绑定ActiveEffect和Dep的，这二者之间也是双向绑定的关系

trigger()方法通过target和key找到Dep，收集所有的computedEffect和Effect，然后依次运行两者

computedEffect提供了schduler，执行effect.options.scheduler(effect), 没有提供的则直接执行effect()

### 函数注释和重载

```js
type Ret<T, R> = (foo: T) => R
function cache<T, R extends string>(fn: Ret<T, R>): Ret<T, R>
function cache(fn: Function) {
  const m = new Map()
  return function (foo: any) {
    if (m.has(foo)) {
      return m.get(foo)
    } else {
      const bar = fn(foo)
      m.set(foo, bar)
      return bar
    }
  }
}

function foo(a: number) {
  return a + ''
}

var bar = cache(foo)

// https://vuejsdevelopers.com/2020/03/16/vue-js-tutorial/
function denote(value: void): never
function denote<T>(value: T): [T, string]
function denote(value: unknown) {
  if (value === null || value === undefined) {
    throw new Error('value can not be empty')
  }
  return [value, (value as any).toString()]
}

var d = denote(77)
```