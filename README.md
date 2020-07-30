## GONEList-Web

<img align="right" width="240" src="https://gonelist-doc.cugxuan.cn/img/logo/logo.png">

这是一款使用 golang + vue 编写的基于 onedrive 的在线共享网盘

效果展示：https://gonelist.cugxuan.cn

后端项目地址：https://github.com/cugxuan/gonelist

详细文档地址：https://gonelist-doc.cugxuan.cn

有问题请提 issue，也可以进入 QQ 群交流，群号：1083165608

## 功能特性

- 文件浏览

- 文件下载

- 在线视频播放

- 在线音频播放

## 项目说明

正在使用 vue + iview 搭建

### 视频播放和音频播放

视频播放库 [DPlayer](http://dplayer.js.org/)


音频播放库 [APlayer](https://aplayer.js.org/)

## 注意事项

### publicPath不建议修改

要实现根据hash去寻找对应文件夹下的文件，本项目把路由设置为history模式，[使用history模式要尽量避免使用publicPath](https://cli.vuejs.org/zh/config/#publicpath)，打包后的文件放置在根目录

相对 publicPath 的限制

相对路径的 publicPath 有一些使用上的限制。在以下情况下，应当避免使用相对 publicPath:

- 当使用基于 HTML5 history.pushState 的路由时；

- 当使用 pages 选项构建多页面应用时。


同样关于vue-router hash模式与history模式可以参考[官方文档](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

