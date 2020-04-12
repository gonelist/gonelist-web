import axios from "axios"
// 创建实例时设置配置的默认值
var service = axios.create({
  timeout: 15000 
});
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log(res);
    return res;
  },
  error => {
    alert("请求失败")
    console.log('err' + error);// for debug
  }
);
export default service;