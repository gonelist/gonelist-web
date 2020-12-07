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

export function searchAll(baseURL, key, token) {
  return request({
    method: "get",
    url: `${baseURL}/onedrive/search`,
    params: {
      key
    },
    cancelToken: token
  });
}
