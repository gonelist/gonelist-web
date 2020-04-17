# GONEList-Web

## 项目配置

在project.config.js里面配置

## 视频播放和音频播放

视频播放库 [DPlayer](http://dplayer.js.org/)


音频播放库 [APlayer](https://aplayer.js.org/)

## publicPath不建议修改

要实现根据hash去寻找对应文件夹下的文件，本项目把路由设置为history模式，[使用history模式要尽量避免使用publicPath](https://cli.vuejs.org/zh/config/#publicpath)，打包后的文件放置在根目录

相对 publicPath 的限制

相对路径的 publicPath 有一些使用上的限制。在以下情况下，应当避免使用相对 publicPath:

- 当使用基于 HTML5 history.pushState 的路由时；

- 当使用 pages 选项构建多页面应用时。


同样关于vue-router hash模式与history模式可以参考[官方文档](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

