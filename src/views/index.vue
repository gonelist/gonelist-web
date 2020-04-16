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
                <span v-for="(item,index) in path" :key="item" @click="toPath(index)">
                  <span>{{item=='/' ? 'root':item}}</span>
                  <span style="padding-left:5px" v-if="item || item!= '/'">/ </span>
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
              <tr class="item" v-for="(file,index) in (files.children || [])" v-bind:key="file.name">
                <td class="list-data" v-if=" !keywords || reg.test(file.name)">
                  <a :href="path.length == 1 ? (href  + file.name) : (href +'/'  +file.name)" :title="path.length == 1 ? (href  +file.name) : (href+ '/'  +file.name)" v-if="file.is_folder" @click.prevent="nextFile(index)">
                    <span class="icon-folder-open"></span>
                    <span>{{file.name}}</span>
                  </a>
                  <a :href="baseurl + 'd' + file.path" :title="file.download_url" target="_blank" v-else>
                    <span class="icon-file-text2"></span>
                    <span>{{file.name}}</span>
                  </a>
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
      path: [],
      keywords: "",
      reg: /""/,
      hash: "",
      // origin + parh + hash
      href: "",
      // origin + path
      baseurl: ""
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.init()
      },
      // 深度观察监听
      deep: true
    }
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
    init() {
      this.hash = decodeURIComponent(window.location.hash)
      // hash为空或者hash为#/都认为hash为#/    
      if(!this.hash) {
        this.hash = '#/'
      } else {
        if(this.hash!= "#/" && this.hash[this.hash.length-1] == '/') {
          // hash以/结尾，去掉结尾的/
          this.hash = this.hash.slice(0,-1)
        }
      }
      this.baseurl = decodeURIComponent(window.location.origin) + decodeURIComponent(window.location.pathname) 
      this.href = this.baseurl + this.hash
      console.log("格式化后的hash：",this.hash)
      // 通过search来查找对应的文件夹,需要decodeURI一下
      this.path = this.hash.slice(1).split("/");
      // 将最后的空元素删除
      // 如果最后一个元素是 "" 就删
      if(this.path[this.path.length-1] == '') {
        console.log("pop掉最后一个")
        this.path.pop()
      }
      // 将hash置为/
      if(this.path[0] == "") {
        this.path[0] = "/"
      }
      console.log("path数组：",this.path)
      let param = decodeURIComponent(window.location.hash)
      if(param[param.length-1] == '/') {
        param = param.slice(1,-1)
      } else {
        param = param.slice(1)
      }
      console.log("请求的参数：",param)
      getAllFiles(this.baseURL, param).then(res => {
        if(res.code == 400) {
          window.location.href = `${this.baseURL}/login`;
        } else if(res.code == 10002) {
          alert(res.msg)
        } else {
          this.files = res.data;
          this.Ishow = res ? 1 : 0;       
          if(!this.files) {
            this.files = []
          } else {
             // 如果匹配到文件夹就直接下载
            if(!this.files.is_folder) {
              this.files.children = []
              this.files.children.push(this.files)
              console.log("下载",this.files.download_url)
              //window.open(this.files.download_url, "_blank")
              window.location.href = this.files.download_url
            }
            
            // 排序一下
            this.files.children ? this.files.children.sort(this.sortByFileType) : this.files.children;
          }
        
         
        }
        
      })
    },
    nextFile(index) {
      // if(this.files.children[index].download_url) {
      //   // // 有下载链接直接下载
      //   console.log("下载",this.files.children[index].download_url)
      //   window.open(this.files.children[index].download_url, "_blank")

      // } else {
      //   if(this.path.length == 1) {
      //     this.hash  =  this.hash + this.files.children[index].name         
      //   } else {
      //     this.hash  =  this.hash + '/'  + this.files.children[index].name
      //   }
        
      //   window.location.hash = this.hash
      // }
      if(this.path.length == 1) {
        this.hash  =  this.hash + this.files.children[index].name         
      } else {
        this.hash  =  this.hash + '/'  + this.files.children[index].name
      }
      
      window.location.hash = this.hash
    },
    back() {
      //console.log(this.path.length)
      if(this.path.length == 1) {
        console.log("已在根目录，无法返回")
      } else {
        this.path.pop()
        this.hash = "";
        for(let i = 0; i < this.path.length; i++) {
          if(i == 0 || i==1) {
            this.hash = this.hash + this.path[i];
          } else {
            this.hash = this.hash + '/' + this.path[i];
          }       
        }
        window.location.hash = this.hash
      }
    },
    toPath(index) {
      if(index+1 != this.path.length) {
        this.hash = ""
        this.path = this.path.slice(0, index+1)
        for(let i = 0; i < this.path.length; i++) {
          if(i == 0 || i==1) {
            this.hash = this.hash + this.path[i];
          } else {
            this.hash = this.hash + '/' + this.path[i];
          }       
        }
        window.location.hash = this.hash
      } else {
        console.log("已在该目录")
      }    
    },
    search() {
      this.reg = new RegExp(this.keywords);
    },
    exit() {
      logout(this.baseURL).then(res => {
        window.location.hash = ""
      })
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
    /* .item {
      cursor: pointer;
    } */
    td a {
      display: inline-block;
      width: 100%;
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
