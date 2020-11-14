import { Component } from 'react';
import Watcher from 'core/observer/watcher'
import observer from './observer'
import Vue from './runtime/index'

export default (options) => {
  const store = new Vue(options);
  class VueComponent extends Component {
    constructor(props, context) {
      super(props, context);
      store.props = props;
      var cb = this.forceUpdate.bind(this);
      var render = this.render.bind(this);
      var watcher = new Watcher({ _watchers: [] }, render, cb, { lazy: true });
      this.render = watcher.get.bind(watcher);
      watcher.lazy = false;
      watcher.run = cb;
      this.$vuewatcher = watcher;
    }

    componentDidMount() {
      if (typeof options.mounted === 'function') {
        options.mounted.call(store);
      }
    }

    componentWillUnmount() {
      if (typeof options.destroyed === 'function') {
        options.destroyed.call(store);
      }
    }

    render() {
      return typeof options.render === 'function'
        ? options.render.call(store)
        : null;
    }
  }
  return observer(VueComponent);
};
