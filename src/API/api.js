import request from "../utils/request"

export function getAllFiles(baseURL, path) {
  return request({
    method: "get",
    url: `${baseURL}/onedrive/getpath`,
    params: {
      path: path || '/'
    }
  })
}
export function logout(baseURL) {
  return request({
    method: "get",
    url: `${baseURL}/cancelLogin`
  })
}