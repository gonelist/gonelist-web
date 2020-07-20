import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import { Message, Table, Notice, Icon, Modal, Input } from "view-design";
Vue.prototype.$Message = Message;
Vue.prototype.$Notice = Notice;
Vue.component("Table", Table);
Vue.component("Icon", Icon);
Vue.component("Input", Input);
Vue.component("Modal", Modal);
Vue.config.productionTip = false;

if (process.env.NODE_ENV === "production") {
  // 为生产环境配置...
  let startApp = function() {
    axios.get("serverconfig.json").then(res => {
      console.log(res);
      // 基础地址
      Vue.prototype.baseURL = res.data.baseURL;
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount("#app");
    });
  };

  startApp();
} else {
  // 为开发环境配置...
  Vue.prototype.baseURL = "https://gonelist.cugxuan.cn";
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
