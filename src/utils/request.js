import axios from "axios";
import Vue from "vue";
// 创建实例时设置配置的默认值
const service = axios.create({
  timeout: 300000
});
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if ("message" in error) {
      if (error.message === "cancel_request_error") {
        return Promise.reject(error);
      }
    }

    Vue.prototype.$Message.error("请求失败");
    console.log("err", error);
  }
);
export default service;
