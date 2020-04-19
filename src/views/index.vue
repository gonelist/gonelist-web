<template>
  <div class="content" v-if="Ishow">
    <div class="title">
       <h1>GONEList</h1>
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
              <span id="back" @click="back" title="返回上一级"><i class="fa fa-arrow-left" aria-hidden="true"></i></span>
            </div>

            <div class="search-container">
                <input id="search" v-model="keywords" placeholder="Search" @keyup="search()">
            </div>
        </div>

        <div class="list-body-container">
          <Table :loading="loading" :columns="header" :data="files.children | filterData(reg, keywords)">
            <template slot-scope="{ row, index }" slot="name">
                <a :href="path.length == 1 ? (href  + row.name) : (href +'/'  +row.name)" :title="path.length == 1 ? (href +row.name) : (href+ '/'  +row.name)" v-if="row.is_folder" @click.prevent="nextFile(index)">
                  <span class="file-icon"><i class="fa fa-folder-open" aria-hidden="true"></i> </span>
                  <span>{{row.name}}</span>
                </a>
                <a :href="baseurl + 'd' + row.path" :title="baseurl + 'd' + row.path" target="_blank" v-else>                
                  <span  class="file-icon"> 
                    <i class="fa" v-bind:class="['fa-file-' + checkFile(row.name) + '-o']" aria-hidden="true"></i> 
                  </span>
                  <span>{{row.name}}</span>
                </a>
            </template>
            <template slot-scope="{ row }" slot="last_modify_time">
                {{ row.last_modify_time | formatTime  }}
            </template>
            <template slot-scope="{ row }" slot="size">
                {{ row.size | formatSize }}
            </template>
            <template slot-scope="{ row,index }" slot="action">
              <!-- 生产环境 -->
              <div class="paly" v-if="isProduction">
                <span v-if="checkFile(row.name) == 'video'" @click="playVideo(baseurl + 'd' + row.path,index)">
                  <i class="fa fa-stop" title="停止" aria-hidden="true" v-if="(video.hash == hash && video.index == index)"></i> 
                  <i class="fa fa-play" title="播放" aria-hidden="true" v-else></i> 
                </span> 
                <span v-else-if="checkFile(row.name) == 'audio'" @click="playAudio(baseurl + 'd' + row.path,index)">      
                  <i class="fa fa-stop" title="停止" aria-hidden="true" v-if="(audio.hash == hash && audio.index == index)"></i> 
                  <i class="fa fa-play" title="播放" aria-hidden="true" v-else></i> 
                </span>      
              </div>
              <!-- 开发环境 -->
              <div class="play" v-else>
                <span v-if="checkFile(row.name) == 'video'" @click="playVideo(row.download_url,index)">
                  <i class="fa fa-stop" title="停止" aria-hidden="true" v-if="(video.hash == hash && video.index == index)"></i> 
                  <i class="fa fa-play" title="播放" aria-hidden="true" v-else></i> 
                </span> 
                <span v-else-if="checkFile(row.name) == 'audio'" @click="playAudio(row.download_url,index)">      
                  
                  <i class="fa fa-stop" title="停止" aria-hidden="true" v-if="(audio.hash == hash && audio.index == index)"></i> 
                  <i class="fa fa-play" title="播放" aria-hidden="true" v-else></i>
                </span>    
              </div>                         
            </template>
          </Table>
        </div>
        
      </div>
    </div>
    <!-- <My-DPlayer :video="video" ref="mydplayer" v-on:close="closePlayer" v-show="video.show"></My-DPlayer>  -->
    <D-Player v-on:closeVideo="closeV" ref="mydplayer" v-show="video.show"></D-Player>
    <A-Player v-on:closeAudio="closeA" ref="myaplayer" v-show="audio.show"></A-Player>
  </div>
</template>

<script>
import { getAllFiles,logout } from "../API/api"
import { checkFileType } from '../utils/index'
import DPlayer from '../components/Dplayer';
import APlayer from '../components/Aplayer'

export default {
  name: "Index",
  components: {
    "D-Player": DPlayer,
    "A-Player": APlayer
  },
  data() {
    return {
      header:[ 
        {
          title : "文件",
          slot: "name",
          minWidth: 400
        },
        {
          title : "时间",
          slot: "last_modify_time",
          align:"right",
          width:200
        },
        {
          title : "大小",
          slot: "size",
          align: "right",
          width:100
        },
        {
          title: " ",
          slot: "action",
          width: 100,
          align: "center",
        }
      ],
      loading: true,
      Ishow: 0,
      files: [],
      path: [],
      keywords: "",
      reg: /""/,
      hash: "",
      // origin + parh + hash
      href: "",
      // origin + path
      baseurl: "",
      video: {
        show: false,
        index: -1, // 点击的元素
        // 记录正在播放视频的文件夹
        hash: ""
      },
      audio: {
        show: false,
        index: -1,
        hash: ""
      },
      isProduction: false
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
    },
    filterData(files,reg,keywords) {
      if(!keywords) {
        return files
      } else {
        return files.filter(item => reg.test(item.name))
      }
    }
  },
  methods: {
    init() {
      this.keywords = ""
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
      console.log(process.env.NODE_ENV )
      if (process.env.NODE_ENV === 'production') {
        this.isProduction = true
        this.baseurl = decodeURIComponent(window.location.origin) + decodeURIComponent(window.location.pathname) 
      } else {
        this.baseurl = decodeURIComponent(this.baseURL) + decodeURIComponent(window.location.pathname) 
      }
      
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
        this.loading = false
        if(res.code == 400) {
          window.location.href = `${this.baseURL}/login`;
        } else if(res.code == 10002) {
          this.$Message.error(res.msg)
        } else {
          this.files = res.data;
          this.Ishow = res ? 1 : 0;       
          if(!this.files.children) {
            this.files.children = []
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
        this.$Message.warning("已在根目录，无法返回")
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
        this.$Message.warning("已在该目录")
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
    },
    playVideo(playurl,index) {    
      // 如果没有正在播放的视频
      if(!this.video.show) {
        this.video.index = index
        this.video.show = true
        this.video.hash = this.hash
        this.$refs.mydplayer.play(playurl)
      } else {
        //如果有正在播放的视频，判断当前文件夹是否为正在播放的视频的文件夹
        if(this.video.hash == this.hash) {
          // 是正在播放的文件夹
          if(this.video.index == index) {
            // 点击的是相同的视频，关闭视频
            this.$refs.mydplayer.close()
            this.video.index = -1
          } else {
            // 点击的是不同的视频，switch
            this.video.index = index
            this.$refs.mydplayer.switch(playurl)
          }
         
        } else {
          // 不是正在播放的文件夹，switchVideo
          this.video.index = index
          this.$refs.mydplayer.switch(playurl)
          this.video.hash = this.hash
        }
        
      }    
    },
    playAudio(playurl,index) {
      let audio = {
        artist: this.files.children[index].name.split('-')[0],
        name: this.files.children[index].name.split('-')[1],
        url: playurl
      }
      if(!this.audio.show) {
        this.audio.index = index
        this.audio.show = true
        this.audio.hash = this.hash
        this.$refs.myaplayer.play(audio)
      } else {
        //如果有正在播放的视频，判断当前文件夹是否为正在播放的视频的文件夹
        if(this.audio.hash == this.hash) {
          // 是正在播放的文件夹
          if(this.audio.index == index) {
            // 点击的是相同的视频，关闭视频
            this.$refs.myaplayer.close()
            this.audio.index = -1
          } else {
            // 点击的是不同的视频，switch
            this.audio.index = index
            this.$refs.myaplayer.switch(audio)
          }
         
        } else {
          // 不是正在播放的文件夹，switchaudio
          this.audio.index = index
          this.$refs.myaplayer.switch(audio)
          this.audio.hash = this.hash
        }
        
      }    
    },
    closeV() {
      this.video.show = false
      this.video.index = -1
    },
    closeA() {
      this.audio.show = false
      this.audio.index = -1
    },
    checkFile(name) {
      return checkFileType(name)
    }
  }

}
</script>

<style>
 
  @media (max-width:992px) { 
    .title,.list-wrapper {
      width: 100%;
    }
  }
  @media (min-width:993px) { 
    .title,.list-wrapper {
      width: 80%;
    }
  }

    body {
        background-color: rgb(247, 247, 249);
    }
    .title {
      margin: 0 auto;
      padding: 25px 0;
    }
    .title h1 {
      text-align: left;
      color: rgb(51, 51, 51);
      letter-spacing: 2px;
      line-height: 64px;
      margin:0;
    }
  

    .title-icon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      font-size: 1.2em;
    }
    #back {
      float: right;
      font-size: 18px;
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
    .list-wrapper {
       
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
    .file-icon {
      padding-right: 10px;
    }
    .ivu-table td {
      border-bottom: none;
    }
    .ivu-table a {
      display: inline-block;
      width: 100%;
    }
    .ivu-table a:hover {
      font-weight: bolder;
    }
    .ivu-table th {
      background: #fff;
      border-bottom: none;
    }
    .ivu-table-cell {
      white-space: nowrap;
    }
    .ivu-table-row-hover .ivu-table-cell {
      white-space:normal
    }
  .play span {
    padding: 5px;
    cursor: pointer;
  }
</style>
