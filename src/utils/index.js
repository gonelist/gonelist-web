export function checkFileType(name) {
  let type = "";
  name = name.toLowerCase()
  if(/\.(mp4|ogg|webm)$/.test(name)) {
    type = "video";
  } else if (/\.(wav|mp3|ogg|acc|webm)$/.test(name)) {
    type = 'audio'
  } else if(/\.(rar|zip)$/.test(name)) {
    type = 'zip'
  } else if(/\.(png|jpg|jpeg|gif|bmp)$/.test(name)) {
    type = 'image'
  } else if (/\.pdf$/.test(name)) {
    type = 'pdf'
  } else if(/\.(excel|xls|csv)$/.test(name)) {
    type = 'excel'
  } else if(/\.(ppt|pptx)$/.test(name)) {
    type = 'ppt'
  } else if(/\.(doc|docx)$/.test(name)) {
    type = 'word'
  } else if(/\.(c|cpp|java|js|py|css|html|php|ipynb|ts)$/.test(name)) {
    type = 'code'
  } else {
    type = "text";
  }
  return type
}