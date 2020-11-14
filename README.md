# Vue Native

原 git：https://github.com/GeekyAnts/vue-native-core，本项目基于此进行了二次开发。

此 npm 包提供了一个 Vue 构造器，可以将 Vue 的响应式机制、生命周期迁移到 react 上，同时保留了 jsx 写法。

## 使用方法

父组件：

```javascript
// Parent.js
import React from 'react';
import { constructor } from '@minar-kotonoha/vue-native-core';
import Child from './Child';

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
  render() {
    return (
      <div>
        <button onClick={this.trigger}>{this.showChild.toString()}</button>
        {this.showChild && <SubVue count={1} />}
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
