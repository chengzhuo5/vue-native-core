/** @flow */

import Vue from './runtime/index'
import observer from './observer'
import constructor from './constructor'

Vue.observer = observer
Vue.constructor = constructor

export default Vue