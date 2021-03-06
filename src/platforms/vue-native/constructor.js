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
      const newOptions = Object.assign(
        {
          data: {},
        },
        options
      );
      const rawData =
        typeof newOptions.data === 'function'
          ? newOptions.data()
          : newOptions.data;
      const newProps = {};
      let _reactivePropsKey = [];
      if (typeof newOptions.props === 'object') {
        if (Array.isArray(newOptions.props)) {
          for (let i = 0; i < newOptions.props.length; i++) {
            const propsName = newOptions.props[i];
            newProps[propsName] = props[propsName];
          }
        } else {
          const propKeys = Object.keys(newOptions.props);
          for (let i = 0; i < propKeys.length; i++) {
            const propsName = propKeys[i];
            newProps[propsName] = props[propsName];
          }
        }
        _reactivePropsKey = Object.keys(newProps);
        delete newOptions.props;
      }
      const newData = (() => {
        return Object.assign(
          newProps,
          {
            props: {},
          },
          rawData
        );
      }).bind(newOptions);
      newOptions.data = newData;
      this._store = new Vue(newOptions);
      const propKeys = Object.keys(props);
      for (let i = 0; i < propKeys.length; i++) {
        const key = propKeys[i];
        if (_reactivePropsKey.includes(key)) {
          this._store.$set(this._store.props, key, props[key]);
        } else {
          this._store.props[key] = props[key];
        }
      }
      this._store._propsKey = _reactivePropsKey;
      this._store._rawComponent = this;
      this._store._rawProps = props;
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
      if (this._store._rawProps !== this.props) {
        this._store._rawProps = this.props;
        const propKeys = Object.keys(this.props);
        for (let i = 0; i < propKeys.length; i++) {
          const key = propKeys[i];
          if (this._store._propsKey.includes(key)) {
            this._store[key] = this.props[key];
            this._store.$set(this._store.props, key, this.props[key]);
          } else {
            this._store.props[key] = this.props[key];
          }
        }
      }
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
