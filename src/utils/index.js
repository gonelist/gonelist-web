const types = {
  audio: ["wav", "mp3", "ogg", "acc", "webm", "m4a", "flac", "aac"],
  video: [
    "mkv",
    "mp4",
    "webm",
    "avi",
    "mpg",
    "mpeg",
    "rm",
    "rmvb",
    "mov",
    "wmv",
    "asf",
    "ts",
    "flv"
  ],
  archive: ["rar", "zip", "7z", "tar", "gz", "bz2", "xz", "z"],
  image: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
  pdf: ["pdf"],
  excel: ["excel", "xls", "csv", "xlsx"],
  powerpoint: ["ppt", "pptx"],
  word: ["doc", "docx"],
  code: [
    "c",
    "cpp",
    "java",
    "js",
    "py",
    "css",
    "html",
    "php",
    "ipynb",
    "ts",
    "go"
  ],
  text: ["txt"]
};

export function checkFileType(name) {
  const ext = name.split(".").pop();

  for (const type in types) {
    if (types[type].includes(ext)) {
      return type;
    }
  }

  return "text";
}
