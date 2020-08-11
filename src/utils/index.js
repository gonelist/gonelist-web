export function checkFileType(name) {
  let type = "";
  name = name.toLowerCase();
  if (/\.(mkv|mp4|webm|avi|mpg|mpeg|rm|rmvb|mov|wmv|asf|ts|flv)$/.test(name)) {
    type = "video";
  } else if (/\.(wav|mp3|ogg|acc|webm|m4a|flac)$/.test(name)) {
    type = "audio";
  } else if (/\.(rar|zip)$/.test(name)) {
    type = "archive";
  } else if (/\.(png|jpg|jpeg|gif|bmp)$/.test(name)) {
    type = "image";
  } else if (/\.pdf$/.test(name)) {
    type = "pdf";
  } else if (/\.(excel|xls|csv)$/.test(name)) {
    type = "excel";
  } else if (/\.(ppt|pptx)$/.test(name)) {
    type = "powerpoint";
  } else if (/\.(doc|docx)$/.test(name)) {
    type = "word";
  } else if (/\.(c|cpp|java|js|py|css|html|php|ipynb|ts)$/.test(name)) {
    type = "code";
  } else {
    type = "text";
  }
  return type;
}
