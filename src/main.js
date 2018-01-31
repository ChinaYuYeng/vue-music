// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/less/globe.less'
import userem from './util/rem'
import vueLazyload from 'vue-lazyload'
import store from '@/store'
import cache from '@/util/localStorageUtil'
//import '../mock/mock-server'

Vue.prototype.$cache = cache;

Vue.config.productionTip = false

Vue.use(vueLazyload, {
  loading: require('./assets/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created:function(){
  	userem();
  }
})
