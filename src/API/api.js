import request from "../utils/request"

export function getAllFiles(baseURL) {
  return request({
    method: "get",
    url: `${baseURL}/onedrive/getpath`,
    params: {
      path: '/'
    }
  })
}
export function logout(baseURL) {
  return request({
    method: "get",
    url: `${baseURL}/cancelLogin`
  })
}