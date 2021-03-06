# @minar-kotonoha/vue-native-core

原 git：https://github.com/GeekyAnts/vue-native-core，本项目基于此进行了二次开发。

此 npm 包提供了一个 Vue 构造器，可以将 Vue 的响应式机制、生命周期迁移到 react 上，同时保留了 jsx 写法。

## 使用方法

父组件：

```javascript
// Parent.js
import React from 'react';
import { constructor, ref } from '@minar-kotonoha/vue-native-core';
import Child from './Child';

const childRef = ref();
export default constructor({
  data() {
    return {
      showChild: false,
    };
  },
  methods: {
    trigger() {
      this.showChild = !this.showChild;
    },
  },
  mounted() {
    // Vue组件和Vue-React组件以下三种ref使用方式均可，纯React组件只能用第三种。
    childRef.add();
    // childRef.current.add()
    // childRef.current._store.add()
  },
  render() {
    return (
      <div>
        <button onClick={this.trigger}>{this.showChild.toString()}</button>
        {this.showChild && <SubVue ref={childRef} count={1} />}
      </div>
    );
  },
});
```

子组件：

```javascript
// Child.js
import React from 'react';
import { constructor } from '@minar-kotonoha/vue-native-core';

export default constructor({
  props: ['count'], // 此处可以注册属性，注册过的属性可以在this中直接访问，也可以用于computed和watch
  data() {
    return {
      a: 0,
    };
  },
  methods: {
    add() {
      this.a++;
    },
  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    this.a = this.props.count; // this.props可以拿到所有的属性
    this.a = this.count; // this中可以拿到注册过的属性
    console.log('mounted');
  },
  beforeDestroy() {
    console.log('beforeDestroy');
  },
  destroyed() {
    console.log('destroyed');
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  updated() {
    console.log('updated');
  },
  render() {
    return <button onClick={this.add}>{this.a}</button>;
  },
});
```

注：由于只是把 Vue 的响应式机制和生命周期移植，最终导出的依然是 React 组件，故并不影响 React 兼容性，Vue 原生组件不能通过 constructor 的方式使用，可以采用原 git 项目中 loader 的方式。

## 模板指令

为了减少包大小以及考虑到很多用户不喜欢模板指令，本项目默认不包含指令功能，如有需要可以移步[@minar-kotonoha/babel-plugin-react-directives](https://github.com/chengzhuo5/babel-plugin-react-directives)
