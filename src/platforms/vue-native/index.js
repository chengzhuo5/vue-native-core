/** @flow */

import Vue from './runtime/index'
import observer from './observer'
import constructor from './constructor'
import ref from './ref'

Vue.observer = observer
Vue.constructor = constructor
Vue.ref = ref

export default Vue