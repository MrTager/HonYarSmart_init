import Vue from 'vue'
import Vuex from 'vuex'
// import mutations from './mutations'
// import actions from './action'
// import getters from './getters'

//import activities from './modules/activities'
//import test from './modules/test'
import pubilc from './modules/pubilc'

Vue.use(Vuex)

// const state = {
//   suballData: {},
//   nativeSignalData: {}
// }
/**
 * mixin 多个state和getters可添加用
 */
// const mixinState = Object.assign({}, state)

// const mixinGetters = Object.assign({}, getters)

// const mixinMutations = Object.assign({}, mutations)

export default new Vuex.Store({
  // actions,
  // mutations: mixinMutations,
  // state: mixinState,
  // getters: mixinGetters,

  // state:{
       
  // },
  modules:{
      //activities,
      //group,
      //test,
      pubilc
  },
  // actions:{
      
  // }

})
