import request from "../utils/request";

export function GetData(URL) {
  return request({
    method: "get",
    url: URL,
    responseType: "blob"
  });
}

export function Mkdir(baseURL, path, folder_name, secret = "") {
  return request({
    method: "get",
    url: `${baseURL}/onedrive/mkdir?secret=${secret}&path=${encodeURIComponent(
      path
    )}&folder_name=${encodeURIComponent(folder_name)}`
  });
}

export function DeleteFile(baseURL, path, secret = "") {
  return request({
    method: "get",
    url: `${baseURL}/onedrive/delete_file?secret=${secret}&path=${encodeURIComponent(
      path
    )}`
  });
}

export function UpdatePermission(baseURL, secret = "") {
  return request({
    method: "get",
    url: `${baseURL}/update_permission?secret=${secret}`
  });
}

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
    },
    onUploadProgress: progressEvent => {
      let complete =
        (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
      console.log(complete);
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

export function getConfig(baseURL) {
  return request({
    method: "get",
    url: `${baseURL}/info`
  });
}
