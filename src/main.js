// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import axios from 'axios'
import MyBread from '@/components/cusBread.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import Http from './plugins/http'
import App from './App'
import router from './router'
import moment from 'moment'


// 全局组件 面包屑
Vue.component('my-bread', MyBread);
// 处理日期格式的全局过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.use(Http)
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
