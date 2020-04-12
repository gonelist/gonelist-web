<template>
  <div class="content" v-if="Ishow">
    <div class="title">
       <h1>GONEList</h1>
       <!-- <div class="logout" @click="exit"><svg t="1585476980680" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1155" width="48" height="48"><path d="M783.92332 467.520619l-108.097715-108.137692 60.295258-60.295259L917.05661 480.023415l30.142632 30.152626-211.078379 211.078378-60.295258-60.345229 108.097715-108.097715H331.024277V467.530613h452.899043z m-197.046463 556.479361H160.712409a85.470752 85.470752 0 0 1-60.485149-25.02558 85.458759 85.458759 0 0 1-25.055563-60.475155V86.080401C75.171697 38.877599 113.429653 0.579666 160.712409 0.579666h426.164448v85.280862h-383.479043a42.600454 42.600454 0 0 0-42.945255 42.305624v768.247342c0 22.896807 19.188943 42.29563 42.945255 42.29563h383.479043v85.290856z m0 0" fill="#2c2c2c" p-id="1156"></path></svg></div>    -->
    </div>

    <div class="list-wrapper">
      <div class="list-container">

        <div class="header-container">
            <div class="title-icon">
              <h3>
                <span class="icon-home"></span>

                <span v-for="(item,index) in stack" :key="item.name" @click="toPath(index)">
                  <span>{{item.name}}</span>
                  <span style="padding-left:5px" v-if="item.name">/ </span>
                </span>
              </h3>
              <span id="back" class="icon-arrow-left2" @click="back"></span>
            </div>

            <div class="search-container">
                <input id="search" v-model="keywords" placeholder="Search" @keyup="search()">
            </div>
        </div>

         <div class="list-body-container">
          <table class="list-table">
            <tbody>
              <tr class="list-title">
                <th>文件</th>
                <th>时间</th>
                <th>大小</th>
              </tr>
              <tr class="item" v-for="(file,index) in (files.children || [])" v-bind:key="file.name" @click="nextFile(index)">
                <td class="list-data" v-if=" !keywords || reg.test(file.name)">
                  <span class="icon-folder-open" v-if="file.is_folder"></span>
                  <span class="icon-file-text2" v-else></span>
                  <span>{{file.name}}</span>
                </td>
                <td class="list-data" v-if=" !keywords || reg.test(file.name)">{{file.last_modify_time | formatTime}}</td>
                <td class="list-data" v-if=" !keywords || reg.test(file.name)">{{file.size | formatSize}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getAllFiles,logout } from "../API/api"
export default {
  name: "Index",
  data() {
    return {
      Ishow: 0,
      files: [],
      // 记录路径栈，可以优化，即只记录每一层点击过的index，然后通过每层的index往下查找，可节省stack占用的空间
      stack: [],
      keywords: "",
      reg: /""/,
      searchPath: ""
    }
  },
  created() {
    getAllFiles(this.baseURL).then(res => {

      if(res.code == 400) {
        window.location.href = `${this.baseURL}/login`;
      }
      this.files = res.data;
      this.files = this.files || []
      this.Ishow = res ? 1 : 0;
      // 通过hash来查找对应的文件夹,需要decodeURI一下
      let path = decodeURIComponent(window.location.hash).slice(1).split("/");
      // 将最后的空元素删除
      path.pop()
      console.log(path)
      this.stack.push(this.files);
      for(let i = 1; i < path.length; i++) {
        // 查找路径
        let flag = 0;
        this.files.children.forEach(item => {
          if(item.name == path[i]){
            this.files = item;
            flag = 1; //表示找到
          }
        });
        if(!flag) {
          // 没有找到对应文件夹就返回主页
          window.location.hash = "";
          window.location.reload();
          break;
        }
        // 构造路径栈
        this.stack.push(this.files);
      }
      // 排序一下
      this.files.children ? this.files.children.sort(this.sortByFileType) : this.files.children;
    })
  },
  watch: {
    // 监听stack的变化，在路径中添加hash
    stack() {
      this.searchPath = "";
      for(let i = 0; i < this.stack.length; i++) {
        this.searchPath = this.searchPath + this.stack[i].name + '/';
      }
      window.location.hash = this.searchPath;
    },
    // $route: {
    //   handler: function(val, oldVal){
    //     window.location.reload()
    //   },
    //   // 深度观察监听
    //   deep: true
    // }

  },
  filters: {
    formatTime(time) {
      return time.replace(/[T,Z]/g,"  ")
    },
    formatSize(size) {
      let result;
      // size为字节
      if(size/1024/1024/2014 >=1) {
        // 可以转化为GB就转化为GB
        result = (size/1024/1024/2014).toFixed(2) + "GB";
      } else if (size/1024/1024 >=1) {
        // 可以转化为MB就转化为MB
        result = (size/1024/1024).toFixed(2) + "MB";
      } else {
        // 否则转化为KB
        result = (size/1024).toFixed(2) + "KB";
      }
      return result;
  }
  },
  methods: {
    nextFile(index) {
      if(this.files.children[index].download_url) {
        // 有下载链接直接下载
        console.log("下载",this.files.children[index].download_url)
        window.open(this.files.children[index].download_url, "_blank")

      } else {
        this.keywords = "";
        // 点击文件夹进入下一个文件夹，并使其入栈
        this.files = this.files.children[index];
        // 排序一下
        this.files.children ? this.files.children.sort(this.sortByFileType) : this.files.children;
        this.stack.push(this.files);
      }


    },
    back() {
      if(this.stack.length == 1) {
        console.log("已在根目录，无法返回")
      } else {
        this.keywords = "";
        this.stack.pop()
        // 显示栈顶元素
        this.files = this.stack[this.stack.length-1]
        // 排序一下
        this.files.children ? this.files.children.sort(this.sortByFileType) : this.files.children;
      }

    },
    toPath(index) {
      //console.log(index);
      this.keywords = "";
      this.stack = this.stack.slice(0, index+1)
      this.files = this.stack[this.stack.length-1]
      // 排序一下
      this.files.children ? this.files.children.sort(this.sortByFileType) : this.files.children;
    },
    search() {
      this.reg = new RegExp(this.keywords);
    },
    exit() {
      logout(this.baseURL).then(res => {
        this.clear();
        console.log(res)
      })
    },
    clear() {
      this.files = [];
      this.stack = [];
      this.keywords = "";
      this.reg = /""/;
      this.searchPath= "";
    },
    sortByFileType(pre, next) {
      let num1,num2;
      num1 = pre.is_folder ? 1 : 0;
      num2 = next.is_folder? 1 : 0;
      return num2-num1;
    }
  }

}
</script>

<style>
    @font-face{
        font-family: 'icomoon';
        src : url("data:application/x-font-woff;charset=utf-8;base64,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") format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: block;
    }
    [class^="icon-"], [class*=" icon-"] {
        font-family: 'icomoon' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-home:before {
        content: "\e900";
        padding-right: 10px;
    }
    .icon-folder-open:before {
        content: "\e930";
    }
    .icon-file-text2:before {
        content: "\e926";
    }
    .icon-arrow-left2:before {
        content: "\ea40";
    }
    body {
        background-color: rgb(247, 247, 249);
    }
    .title {
      font-size: 0;
      overflow: hidden;
      width: 80%;
      margin: 0 auto;
      height: 64px;
      padding: 15px 0;
    }
    .title h1 {
      float: left;
      font-size: 28px;
      text-align: center;
      color: rgb(51, 51, 51);
      letter-spacing: 2px;
      line-height: 64px;
      margin:0;
    }
    .title .logout {
      float: right;
      height: 100%;
      cursor: pointer;

    }
    .logout svg {
        margin-top: 17px;
       height: 30px;
       width:30px
    }
    a {
            text-decoration: none;
            color: black;
        }
    .title-icon {
      font-size: 0;
      overflow: hidden;
    }
    .title-icon h3 {
      font-size: 18px;
      float: left;
    }
    #back {
      float: right;
      font-size: 18px;
      padding-top: 16px;
      box-sizing: border-box;
      cursor: pointer;
    }
     #search{
        margin: 0;
        border: 0 none;
        border-radius:15px;
        width: 100%;
        padding: 5px 10px;
        text-align: left;
        font-size: inherit;
        color: #000000;
        background-color: white;
        outline: none;
        box-sizing: border-box;
    }
    h3>span>span:first-child {
      cursor: pointer;
    }
    h3>span>span:first-child:hover{
        text-decoration: underline;
    }
    .list-data span:last-child {
        color: black;
        padding-left: 10px;
    }
    table {
        table-layout: fixed;
        word-break: break-all;
    }
    .item {
      cursor: pointer;
    }
    th {
        font-weight: bold;
        text-align: right;
    }
    th:first-child {
        text-align: left;
        padding: 5px;
        padding-left: 25px;
        width: 68%;
    }
    th:nth-child(2),th:nth-child(3),td:nth-child(2),td:nth-child(3){
        text-align: right;
        width: 30%;
    }
    th:nth-child(3),td:nth-child(3){
        width: 20%;
    }
    td {
        font-weight: normal;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    td:first-child{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    td:first-child:hover {
        overflow: visible;
        text-overflow: clip;
        font-weight: bold;
        white-space: normal;
    }
    .list-wrapper {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 40px;
        position: relative;
        box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.1);
    }
    .header-container {
        margin: 0;
        border: 0 none;
        padding: 10px 30px 10px 30px;
        text-align: left;
        font-weight: normal;
        color: #000000;
        background-color: #f7f7f9;
    }
    .list-body-container {
        left: 0;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
        background: white;
        position: relative;
    }
    .list-table {
        width: 100%;
        padding: 15px;
        border-spacing: 0;
    }
    .item:hover {
        background-color: gainsboro;
    }

</style>
