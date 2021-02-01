// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Bridge from './config/JSbridge.js'
import store from './store'
import 'vue-stone/dist/vue-stone.css'
import * as smartPadUtils from './utils'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)

import vuescroll from 'vuescroll';

Vue.use(vuescroll,{});

Vue.use(Vuex)
Vue.prototype.$bridge = Bridge
Vue.prototype.$smartPadUtils = smartPadUtils
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
