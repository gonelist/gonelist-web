<template>
  <div class="content">
    <div class="title">
      <h1>GONEList</h1>
    </div>

    <div class="list-wrapper">
      <div class="list-container">
        <div class="header-container">
          <div class="title-icon">
            <h3>
              <span><i class="fa fa-home" aria-hidden="true"></i> </span>
              <span
                v-for="(item, index) in path"
                :key="item"
                @click="toPath(index)"
              >
                <span>{{ item === "/" ? "root" : item }}</span>
                <span style="padding-left: 5px" v-if="item || item !== '/'"
                  >/
                </span>
              </span>
            </h3>
            <Icon
              type="md-arrow-back"
              id="back"
              @click="back"
              title="返回上一级"
            />
          </div>

          <div class="search-container">
            <Input
              v-model="keywords"
              placeholder="Search"
              @keyup.native="search"
            />
            <!-- <Select v-model="serach_type" slot="prepend" style="width: 150px">
              <Option value="cur">当前文件夹搜索</Option>
              <Option value="all">全局搜索</Option>
            </Select> -->
          </div>
        </div>

        <div class="list-body-container">
          <Table
            :loading="loading"
            no-data-text="暂无文件"
            :columns="header"
            :data="files.children | filterData(reg, keywords)"
          >
            <template slot-scope="{ row, index }" slot="name">
              <a
                :href="
                  path.length === 1 ? href + row.name : href + '/' + row.name
                "
                :title="
                  path.length === 1 ? href + row.name : href + '/' + row.name
                "
                v-if="row.is_folder"
                @click.prevent="nextFile(index, row.name)"
              >
                <span class="file-icon"
                  ><i class="fa fa-folder-open" aria-hidden="true"></i>
                </span>
                <span>{{ row.name }}</span>
              </a>
              <a
                :href="baseurl + 'd' + row.path"
                :title="baseurl + 'd' + row.path"
                target="_blank"
                v-else
              >
                <span class="file-icon">
                  <i
                    class="fa"
                    v-bind:class="['fa-file-' + checkFile(row.name) + '-o']"
                    aria-hidden="true"
                  ></i>
                </span>
                <span>{{ row.name }}</span>
              </a>
            </template>
            <template slot-scope="{ row }" slot="last_modify_time">
              {{ row.last_modify_time | formatTime }}
            </template>
            <template slot-scope="{ row }" slot="size">
              {{ row.size | formatSize }}
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <!-- 生产环境 -->
              <div v-if="isProduction">
                <span
                  class="play"
                  v-if="checkFile(row.name) === 'video'"
                  @click="playVideo(baseurl + 'd' + row.path, index)"
                >
                  <i
                    class="fa fa-stop"
                    title="停止"
                    aria-hidden="true"
                    v-if="video.hash === hash && video.index === index"
                  ></i>
                  <i
                    class="fa fa-play"
                    title="播放"
                    aria-hidden="true"
                    v-else
                  ></i>
                </span>
                <span
                  class="play"
                  v-else-if="checkFile(row.name) === 'audio'"
                  @click="playAudio(baseurl + 'd' + row.path, index)"
                >
                  <i
                    class="fa fa-stop"
                    title="停止"
                    aria-hidden="true"
                    v-if="audio.hash === hash && audio.index === index"
                  ></i>
                  <i
                    class="fa fa-play"
                    title="播放"
                    aria-hidden="true"
                    v-else
                  ></i>
                </span>
                <span
                  class="play"
                  title="预览"
                  v-else-if="checkFile(row.name) === 'image'"
                  @click="showImage(baseurl + 'd' + row.path, index)"
                >
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </span>
              </div>
              <!-- 开发环境 -->
              <div v-else>
                <span
                  class="play"
                  v-if="checkFile(row.name) === 'video'"
                  @click="playVideo(row.download_url, index)"
                >
                  <i
                    class="fa fa-stop"
                    title="停止"
                    aria-hidden="true"
                    v-if="video.hash === hash && video.index === index"
                  ></i>
                  <i
                    class="fa fa-play"
                    title="播放"
                    aria-hidden="true"
                    v-else
                  ></i>
                </span>
                <span
                  class="play"
                  v-else-if="checkFile(row.name) === 'audio'"
                  @click="playAudio(row.download_url, index)"
                >
                  <i
                    class="fa fa-stop"
                    title="停止"
                    aria-hidden="true"
                    v-if="audio.hash === hash && audio.index === index"
                  ></i>
                  <i
                    class="fa fa-play"
                    title="播放"
                    aria-hidden="true"
                    v-else
                  ></i>
                </span>
                <span
                  class="play"
                  title="预览"
                  v-else-if="checkFile(row.name) === 'image'"
                  @click="showImage(row.download_url, index)"
                >
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </span>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <div class="readme">
      <div class="card-header">
        <svg
          class="octicon octicon-book"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"
          ></path>
        </svg>
        <h3>README.md</h3>
      </div>
      <div class="markdown-body" v-html="readme"></div>
    </div>
    <!-- <My-DPlayer :video="video" ref="mydplayer" v-on:close="closePlayer" v-show="video.show"></My-DPlayer>  -->
    <D-Player
      v-on:closeVideo="closeV"
      ref="mydplayer"
      v-show="video.show"
    ></D-Player>
    <A-Player
      v-on:closeAudio="closeA"
      ref="myaplayer"
      v-show="audio.show"
    ></A-Player>

    <Modal v-model="modal" title="加密文件" @on-ok="ok" @on-cancel="cancel">
      <Input
        v-model="pass"
        type="password"
        placeholder="请输入密码"
        @keyup.enter.native="ok"
      />
      <p style="color: red" v-show="pass_count > 1">密码错误!</p>
    </Modal>
    <Modal v-model="img_modal" title="图片预览" :footer-hide="true">
      <img :src="img_src" alt="" style="width: 100%; height: 100%" />
    </Modal>

    <M-Footer></M-Footer>
  </div>
</template>

<script>
// import { getAllFiles, logout, getReadme, searchAll } from "../API/api";
import { getAllFiles, logout, getReadme } from "../API/api";
import { checkFileType } from "../utils/index";
import DPlayer from "../components/Dplayer";
import APlayer from "../components/Aplayer";
import Footer from "../components/Footer";

export default {
  name: "Index",
  components: {
    "D-Player": DPlayer,
    "A-Player": APlayer,
    "M-Footer": Footer
  },
  data() {
    return {
      header: [],
      headerCopy: [
        {
          title: "文件",
          slot: "name",
          key: "is_folder",
          // minWidth: 400,
          sortable: true,
          sortType: "desc",
          sortMethod: (a, b, type) => {
            if (type === "desc") {
              return a > b ? -1 : 1;
            } else {
              return a > b ? 1 : -1;
            }
          }
        },
        {
          title: "时间",
          slot: "last_modify_time",
          key: "last_modify_time",
          align: "right",
          // width: 200,
          sortable: true,
          //desc倒序 asc顺序
          sortMethod: (a, b, type) => {
            let at = new Date(a);
            let bt = new Date(b);
            if (type === "desc") {
              return at > bt ? -1 : 1;
            } else return at > bt ? 1 : -1;
          }
        },
        {
          title: "大小",
          slot: "size",
          key: "size",
          align: "right",
          // width: 100,
          sortable: true,
          //desc倒序升序 asc顺序降序
          sortMethod: (a, b, type) => {
            if (type === "desc") {
              return a > b ? -1 : 1;
            } else return a > b ? 1 : -1;
          }
        },
        {
          title: " ",
          slot: "action",
          width: 50,
          align: "center"
        }
      ],
      loading: true,
      files: [],
      path: [],
      keywords: "",
      serach_type: "cur",
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
      isProduction: false,
      readme: "",
      modal: false,
      pass: "",
      pass_count: 0,
      img_modal: false,
      img_src: ""
    };
  },
  mounted() {
    window.onresize = () => {
      this.checkWidth();
    };
  },
  created() {
    this.checkWidth();
    this.init();
  },
  watch: {
    $route: {
      handler: function() {
        this.init();
      },
      // 深度观察监听
      deep: true
    }
  },
  filters: {
    formatTime(time) {
      return time.replace(/[T,Z]/g, "  ");
    },
    formatSize(size) {
      let result;
      // size为字节
      if (size / 1024 / 1024 / 1024 >= 1) {
        // 可以转化为GB就转化为GB
        result = (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
      } else if (size / 1024 / 1024 >= 1) {
        // 可以转化为MB就转化为MB
        result = (size / 1024 / 1024).toFixed(2) + "MB";
      } else {
        // 否则转化为KB
        result = (size / 1024).toFixed(2) + "KB";
      }
      return result;
    },
    filterData(files, reg, keywords) {
      return keywords
        ? files.filter(item => reg.test(item.name.toLowerCase()))
        : files;
    }
  },
  methods: {
    init() {
      this.keywords = "";
      this.hash = decodeURIComponent(window.location.hash);
      // hash为空或者hash为#/都认为hash为#/
      if (!this.hash) {
        this.hash = "#/";
      } else {
        if (this.hash !== "#/" && this.hash[this.hash.length - 1] === "/") {
          // hash以/结尾，去掉结尾的/
          this.hash = this.hash.slice(0, -1);
        }
      }
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV === "production") {
        this.isProduction = true;
        this.baseurl =
          decodeURIComponent(window.location.origin) +
          decodeURIComponent(window.location.pathname);
      } else {
        this.baseurl =
          decodeURIComponent(this.baseURL) +
          decodeURIComponent(window.location.pathname);
      }

      this.href = this.baseurl + this.hash;
      console.log("格式化后的hash：", this.hash);
      // 通过search来查找对应的文件夹,需要decodeURI一下
      this.path = this.hash.slice(1).split("/");
      // 将最后的空元素删除
      // 如果最后一个元素是 "" 就删
      if (this.path[this.path.length - 1] === "") {
        console.log("pop掉最后一个");
        this.path.pop();
      }
      // 将hash置为/
      if (this.path[0] === "") {
        this.path[0] = "/";
      }
      console.log("path数组：", this.path);
      let param = decodeURIComponent(window.location.hash);
      if (param[param.length - 1] === "/") {
        param = param.slice(1, -1);
      } else {
        param = param.slice(1);
      }
      console.log("请求的参数：", param);
      this.loading = true;
      getAllFiles(this.baseURL, param, this.pass).then(res => {
        this.loading = false;
        if (res.code === 400) {
          window.location.href = `${this.baseURL}/login`;
        } else if (res.code === 10002) {
          this.$Message.error(res.msg);
        } else if (res.code === 10007) {
          // 需要输入密码
          this.pass_count++;
          this.modal = true;
        } else {
          this.files = res.data;
          if (!this.files.children) {
            this.files.children = [];
          } else {
            // 如果匹配到文件夹就直接下载
            if (!this.files.is_folder) {
              this.files.children = [];
              this.files.children.push(this.files);
              console.log("下载", this.files.download_url);
              //window.open(this.files.download_url, "_blank")
              window.location.href = this.files.download_url;
            }
          }
        }
      });
      getReadme(this.baseURL, param, this.pass).then(res => {
        this.readme = res.data;
        //console.log(this.readme)
      });
    },
    nextFile(index, name) {
      console.log(name);
      // if (this.path.length === 1) {
      //   this.hash = this.hash + name;
      // } else {
      //   this.hash = this.hash + "/" + name;
      // }
      this.hash =
        this.path.length === 1 ? this.hash + name : this.hash + "/" + name;

      window.location.hash = this.hash;
    },
    back() {
      //console.log(this.path.length)
      if (this.path.length === 1) {
        this.$Message.warning("已在根目录，无法返回");
      } else {
        this.path.pop();
        this.hash = "";
        for (let i = 0; i < this.path.length; i++) {
          if (i === 0 || i === 1) {
            this.hash = this.hash + this.path[i];
          } else {
            this.hash = this.hash + "/" + this.path[i];
          }
        }
        window.location.hash = this.hash;
      }
    },
    toPath(index) {
      if (index + 1 !== this.path.length) {
        this.hash = "";
        this.path = this.path.slice(0, index + 1);
        for (let i = 0; i < this.path.length; i++) {
          if (i === 0 || i === 1) {
            this.hash = this.hash + this.path[i];
          } else {
            this.hash = this.hash + "/" + this.path[i];
          }
        }
        window.location.hash = this.hash;
      } else {
        this.$Message.warning("已在该目录");
      }
    },
    search() {
      this.reg = new RegExp(this.keywords.toLowerCase());
      // if(this.serach_type == "cur") {
      //   this.reg = new RegExp(this.keywords.toLowerCase());
      // } else {
      //   searchAll(this.baseURL, this.keywords).then(res => {
      //     console.log(res.data);
      //     this.files = res.data;
      //   })
      // }
    },
    exit() {
      logout(this.baseURL).then(() => {
        window.location.hash = "";
      });
    },
    playVideo(playUrl, index) {
      // 如果没有正在播放的视频
      console.log(playUrl);
      let video = {
        playUrl: playUrl,
        name: this.files.children[index].name
      };
      if (!this.video.show) {
        this.video.index = index;
        this.video.show = true;
        this.video.hash = this.hash;
        this.$refs.mydplayer.play(video);
      } else {
        //如果有正在播放的视频，判断当前文件夹是否为正在播放的视频的文件夹
        if (this.video.hash === this.hash) {
          // 是正在播放的文件夹
          if (this.video.index === index) {
            // 点击的是相同的视频，关闭视频
            this.$refs.mydplayer.close();
            this.video.index = -1;
          } else {
            // 点击的是不同的视频，switch
            this.video.index = index;
            this.$refs.mydplayer.switch(video);
          }
        } else {
          // 不是正在播放的文件夹，switchVideo
          this.video.index = index;
          this.$refs.mydplayer.switch(video);
          this.video.hash = this.hash;
        }
      }
    },
    playAudio(playUrl, index) {
      let audio = {
        artist: this.files.children[index].name.split("-")[0],
        name: this.files.children[index].name.split("-")[1],
        url: playUrl,
        fullName: this.files.children[index].name
      };
      if (!this.audio.show) {
        this.audio.index = index;
        this.audio.show = true;
        this.audio.hash = this.hash;
        this.$refs.myaplayer.play(audio);
      } else {
        //如果有正在播放的视频，判断当前文件夹是否为正在播放的视频的文件夹
        if (this.audio.hash === this.hash) {
          // 是正在播放的文件夹
          if (this.audio.index === index) {
            // 点击的是相同的视频，关闭视频
            this.$refs.myaplayer.close();
            this.audio.index = -1;
          } else {
            // 点击的是不同的视频，switch
            this.audio.index = index;
            this.$refs.myaplayer.switch(audio);
          }
        } else {
          // 不是正在播放的文件夹，switchaudio
          this.audio.index = index;
          this.$refs.myaplayer.switch(audio);
          this.audio.hash = this.hash;
        }
      }
    },
    closeV() {
      this.video.show = false;
      this.video.index = -1;
    },
    closeA() {
      this.audio.show = false;
      this.audio.index = -1;
    },
    checkFile(name) {
      return checkFileType(name);
    },
    ok() {
      this.modal = false;
      this.init();
    },
    cancel() {
      this.back();
      this.modal = false;
      this.pass_count = 0;
    },
    showImage(url, _index) {
      this.img_modal = true;
      this.img_src = url;
    },
    checkWidth() {
      this.clientHeight = `${document.documentElement.clientWidth}`;
      //console.log(this.clientHeight);
      if (this.clientHeight < 801) {
        this.header = this.headerCopy.filter(item => item.title != "时间");
      } else {
        this.header = this.headerCopy.map(item => {
          if (item.slot == "name") {
            item.minWidth = 400;
          } else if (item.slot == "last_modify_time") {
            item.width = 200;
          } else if (item.slot == "size") {
            item.width = 100;
          } else {
            item.width = 100;
          }
          return item;
        });
      }
    }
  }
};
</script>

<style>
@import url("../assets/index.css");
</style>
