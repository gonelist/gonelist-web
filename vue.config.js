
const ProjectConfig = require("./project.config")

module.exports = {
  //  publicPath: process.env.NODE_ENV === 'production'
  //  ? '/dir-project/dist/'
  //  : '/'
  // 不建议修改
  publicPath: ProjectConfig.publicPath,
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: ProjectConfig.title
    }
  }
}
