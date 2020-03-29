import request from "../utils/request"

export function getAllFiles() {
  return request({
    method: "get",
    url: "onedrive/getpath",
    params: {
      path: '/'
    }
  })
}
export function logout() {
  return request({
    method: "get",
    url: "cancelLogin"
  })
}