// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// import axios from 'axios'
// import VueAxios from 'vue-axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import 'element-theme-default/lib/index.css'
//import './layout/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
// Vue.use(VueAxios, axios)
// Vue.axios.defaults.headers.post['Content-Type'] = 'application/json'

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

window.vm = vm;
