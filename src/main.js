import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

let startApp = function () {
  axios.get('serverconfig.json').then((res) => {
    console.log(res)
    // 基础地址
    Vue.prototype.baseURL = res.data.baseURL;
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}

startApp()


