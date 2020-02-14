import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index.ts'

Vue.config.productionTip = false
import  Vant from 'vant';
import MyPlugin from '@/plugins/MyPlugin.js'
// import { Dialog } from 'vant';

// 全局注册
Vue.use(Vant);
// Vue.use(Dialog);
// import 'vant/lib/index.css';
Vue.use(MyPlugin)
// Vue.use(ImagePreview);

import './filiters/timeFomart.ts'
// console.log(this)
new App({
  store
}).$mount()
