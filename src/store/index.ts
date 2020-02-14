import Vue from 'vue'
import VueX from 'vuex'
Vue.use(VueX)
const store = new VueX.Store({
  state: {
   userInfo:{token:""},
   keywords:""
  },
  mutations: {
    increment (state,payload) {
     state.userInfo=payload
    },
    keywords(state,payload){
      state.keywords=payload
    }
  }
})
export default store