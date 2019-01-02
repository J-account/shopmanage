// axios 与vue没有关系并不是vue的是插件
// 若是想把axios变成插件  可以使用vue.js中的开发插件的方法
// 作用： 发送请求
import axios from 'axios'

const Http = {}
Http.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 4. 添加实例方法
  Vue.prototype.$http = axios
}
export default Http
