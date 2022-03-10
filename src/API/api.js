import request from "../utils/request";

export function Upload(
  baseURL,
  path,
  body,
  pass = "",
  name = "test",
  secret = ""
) {
  return request({
    method: "post",
    url: `${baseURL}/onedrive/upload`,
    params: {
      path: path || "/",
      file_name: name,
      secret: secret
    },
    data: body,
    headers: {
      pass: pass,
      "Content-Type": "multipart/form-data"
    }
  });
}

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
