import { Component } from 'react';
import { nextTick } from 'core/util/index';
import Vue from './runtime/index';
import observer from './observer';

export default (options) => {
  if (!options) {
    throw new Error('Options is required');
  }
  if (typeof options !== 'object') {
    throw new Error('Options must be an object');
  }
  class VueComponent extends Component {
    constructor(props) {
      super(props);
      let data = {}
      if (typeof options.data === 'function') {
        data = options.data()
      } else if (typeof options.data === 'object') {
        data = Object.assign({}, data)
      }
      options.data = () => Object.assign({}, data, {
        props
      });
      this._store = new Vue(options);
      this._store._rawComponent = this;
      this._execLifeCycle('beforeMount');
    }

    componentDidMount() {
      this._store._isMounted = true;
      this._execLifeCycle('mounted');
    }

    componentWillUnmount() {
      this._store._isBeingDestroyed = true;
      this._execLifeCycle('beforeDestroy');
      nextTick(() => {
        this._store._isDestroyed = true;
        if (typeof options.destroyed === 'function')
          options.destroyed.call(this._store);
      });
    }

    _execLifeCycle(funcname) {
      if (typeof options[funcname] === 'function') {
        options[funcname].call(this._store);
      }
    }

    render() {
      this._store.props = this.props;
      if (this._store._isMounted) {
        this._execLifeCycle('beforeUpdate');
        if (typeof options.updated === 'function') {
          nextTick(() => {
            options.updated.call(this._store);
          });
        }
      }
      const el =
        typeof options.render === 'function'
          ? options.render.call(this._store)
          : null;
      return el;
    }
  }
  return observer(VueComponent);
};
