

/*
默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，
例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。

具体可见 ：https://cli.vuejs.org/zh/guide/deployment.html#github-pages
*/
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/dir-project/dist/'
  : '/'
}
