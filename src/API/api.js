import request from "../utils/request";

export function getAllFiles(baseURL, path, pass = "") {
  return request({
    method: "get",
    url: `${baseURL}/onedrive/getpath`,
    params: {
      path: path || "/"
    },
    headers: {
      pass: pass
    }
  });
  // console.log("pass = ", pass)
  // if(pass == "") {
  //   console.log("无密码")
  //   return request({
  //     method: "get",
  //     url: `${baseURL}/onedrive/getpath`,
  //     params: {
  //       path: path || '/'
  //     }
  //   })
  // } else {
  //   console.log("有密码")
  //   return request({
  //     method: "get",
  //     url: `${baseURL}/onedrive/getpath`,
  //     params: {
  //       path: path || '/'
  //     },
  //     headers: {
  //       "pass": pass
  //     }
  //   })
  // }
}
export function logout(baseURL) {
  return request({
    method: "get",
    url: `${baseURL}/cancelLogin`
  });
}
export function getReadme(baseURL, path, pass = "") {
  return request({
    method: "get",
    url: `${baseURL}/README`,
    params: {
      path: path || "/"
    },
    headers: {
      pass: pass
    }
  });
}
