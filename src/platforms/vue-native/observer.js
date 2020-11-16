/**
 * Reference to mobx https://github.com/mobxjs/mobx-react-vue/blob/master/src/observer.js
 */

import React from 'react';
import Watcher from 'core/observer/watcher';

export default function observer(componentClass) {
  if (
    typeof componentClass === 'function' &&
    (!componentClass.prototype || !componentClass.prototype.render) &&
    !componentClass.isReactClass &&
    !React.Component.isPrototypeOf(componentClass)
  ) {
    class Function2Component extends React.Component {
      render() {
        return componentClass.call(this, this.props, this.context);
      }
    }
    Function2Component.displayName =
      componentClass.displayName || componentClass.name;
    Function2Component.contextTypes = componentClass.contextTypes;
    Function2Component.propTypes = componentClass.propTypes;
    Function2Component.defaultProps = componentClass.defaultProps;
    return observer(Function2Component);
  }

  if (!componentClass) {
    throw new Error("Please pass a valid component to 'observer'");
  }

  const target = componentClass.prototype || componentClass;
  mixinLifecycleEvents(target);
  class ObserverClass extends componentClass {
    constructor(props) {
      super(props)
      const cb = this.forceUpdate.bind(this);
      const render = this.render.bind(this);
      const watcher = new Watcher({ _watchers: [] }, render, cb, {
        lazy: true,
      });
      this.render = watcher.get.bind(watcher);
      watcher.lazy = false;
      watcher.run = cb;
      this.$vuewatcher = watcher;
    }
  }
  
  return ObserverClass;
}

function mixinLifecycleEvents(target) {
  for (const key in lifecycleMixin) {
    if (
      key === 'shouldComponentUpdate' &&
      typeof target.shouldComponentUpdate === 'function'
    ) {
      continue;
    }
    patch(target, key);
  }
}

const lifecycleMixin = {
  componentWillUnmount() {
    this.$vuewatcher.teardown();
  },
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      return true;
    }
    return isObjectShallowModified(this.props, nextProps);
  },
};

function patch(target, funcName) {
  const base = target[funcName];
  const mixinFunc = lifecycleMixin[funcName];
  target[funcName] = !base
    ? function () {
        return mixinFunc.apply(this, arguments);
      }
    : function () {
        mixinFunc.apply(this, arguments);
        return base.apply(this, arguments);
      };
}

function isObjectShallowModified(prev, next) {
  if (
    prev == null ||
    next == null ||
    typeof prev !== 'object' ||
    typeof next !== 'object'
  ) {
    return prev !== next;
  }
  const keys = Object.keys(prev);
  if (keys.length !== Object.keys(next).length) {
    return true;
  }
  let key;
  for (let i = keys.length - 1; i >= 0; i--) {
    key = keys[i];
    if (next[key] !== prev[key]) {
      return true;
    }
  }
  return false;
}
