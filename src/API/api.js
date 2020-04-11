import axios from 'axios'

export function getAllFiles(baseURL) {
  return axios({
    method: "get",
    url: `${baseURL}/onedrive/getpath`,
    params: {
      path: '/'
    }
  })
}
export function logout(baseURL) {
  return axios({
    method: "get",
    url: `${baseURL}/cancelLogin`
  })
}