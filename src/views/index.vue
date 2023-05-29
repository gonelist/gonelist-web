<template>
  <div class="content">
    <div class="title">
      <h1>{{ site_config.name }}</h1>
    </div>

    <div class="list-wrapper">
      <div class="list-container">
        <div class="header-container">
          <div class="title-icon">
            <h3>
              <span style="margin-right: 12px"
                ><i aria-hidden="true" class="fa fa-home"></i>
              </span>
              <span
                v-for="(item, index) in path"
                :key="item"
                @click="toPath(index)"
              >
                <span>{{ item === "/" ? "root" : item }}</span>
                <span v-if="item || item !== '/'" style="padding: 0 4px;"
                  >/</span
                >
              </span>
            </h3>
            <Icon
              id="back"
              title="返回上一级"
              type="md-arrow-back"
              @click="back"
            />
          </div>

          <div class="search-container">
            <ButtonGroup class="search-type">
              <Button
                :type="search_global ? 'primary' : 'default'"
                @click="switchSearchGlobal(true)"
                >全局
              </Button>
              <Button
                :type="!search_global ? 'primary' : 'default'"
                @click="switchSearchGlobal(false)"
                >当前
              </Button>
            </ButtonGroup>

            <AutoComplete
              v-if="search_global"
              v-model="keywords"
              class="search-input"
              @keyup.native="search"
              @on-select="redirectSearch"
            >
              <Option
                v-for="(option, index) in search_ends"
                :key="index"
                :value="option.path"
              >
                <span class="demo-auto-complete-title">
                  <i v-if="option.isfloder" class="fa fa-folder"></i>
                  <i v-else class="fa fa-file"></i>
                  {{ option.path }}
                </span>
              </Option>
            </AutoComplete>
            <Input
              v-else
              :key="'input-search'"
              v-model="keywords"
              class="search-input"
              placeholder="搜索"
              search
              @keyup.native="search"
            />
            <br />
            <Button
              v-if="site_config.upload && !site_config.admin_permission"
              class="file-upload"
              type="info"
              @click="update_permission"
              >权限提升
            </Button>
            <Button
              v-if="site_config.admin_permission"
              class="file-upload"
              type="info"
              @click="upload"
              >文件上传
            </Button>
            <Button
              v-if="site_config.admin_permission"
              class="file-upload"
              type="info"
              @click="mkdir"
              >文件夹创建
            </Button>
          </div>
        </div>

        <div class="list-body-container">
          <Table
            :columns="header"
            :data="current_files | filterData(search_global, reg, keywords)"
            :loading="loading"
            no-data-text="暂无文件"
          >
            <template slot="name" slot-scope="{ row, index }">
              <a
                v-if="row.is_folder"
                :href="
                  path.length === 1 ? href + row.name : href + '/' + row.name
                "
                :title="
                  path.length === 1 ? href + row.name : href + '/' + row.name
                "
                @click.prevent="nextFile(index, row.name)"
              >
                <span class="file-icon">
                  <i aria-hidden="true" class="fa fa-folder-open"></i>
                </span>
                <span>{{ row.name }}</span>
              </a>
              <a
                v-else
                :href="baseurl + 'd' + row.path"
                :title="baseurl + 'd' + row.path"
                target="_blank"
              >
                <span class="file-icon">
                  <i
                    aria-hidden="true"
                    class="fa"
                    v-bind:class="['fa-file-' + checkFile(row.name) + '-o']"
                  ></i>
                </span>
                <span>{{ row.name }}</span>
              </a>
            </template>
            <template slot="last_modify_time" slot-scope="{ row }">
              <div style="width: max-content">
                {{ row.last_modify_time | formatTime }}
              </div>
            </template>
            <template slot="size" slot-scope="{ row }">
              <div style="width: max-content">{{ row.size | formatSize }}</div>
            </template>
            <template
              v-if="site_config.admin_permission"
              slot="delete"
              slot-scope="{ row }"
            >
              <span @click="delete_file(row.path, row.name)">
                <svg
                  class="icon"
                  height="20"
                  p-id="2224"
                  version="1.1"
                  viewBox="0 0 1024 1024"
                  width="20"
                  x="1647855783671"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M909.050991 169.476903l-217.554898 0 0-31.346939c0-39.5866-32.205493-71.792093-71.793116-71.792093L408.15591 66.337871c-39.5866 0-71.792093 32.205493-71.792093 71.792093l0 31.346939L113.349581 169.476903c-11.013845 0-19.942191 8.940626-19.942191 19.954471s8.928347 19.954471 19.942191 19.954471l84.264149 0 0 640.687918c0 60.479443 49.203632 109.683075 109.683075 109.683075l416.474366 0c60.479443 0 109.683075-49.203632 109.683075-109.683075L833.454246 209.385844l75.595722 0c11.012821 0 19.942191-8.940626 19.942191-19.954471S920.063813 169.476903 909.050991 169.476903zM376.2482 138.130987c0-17.593703 14.314007-31.907711 31.907711-31.907711l211.547067 0c17.593703 0 31.907711 14.314007 31.907711 31.907711l0 31.346939L376.2482 169.477926 376.2482 138.130987zM793.569864 850.074785c0 38.486546-31.312146 69.798692-69.798692 69.798692L307.297828 919.873478c-38.486546 0-69.798692-31.312146-69.798692-69.798692L237.499136 211.042577l556.070728 0L793.569864 850.074785z"
                    p-id="2225"
                  ></path>
                  <path
                    d="M510.662539 861.276918c11.012821 0 19.954471-8.92937 19.954471-19.942191L530.61701 294.912753c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191L490.708068 841.334727C490.708068 852.347548 499.649717 861.276918 510.662539 861.276918z"
                    p-id="2226"
                  ></path>
                  <path
                    d="M374.562814 801.449321c11.012821 0 19.954471-8.92937 19.954471-19.942191L394.517285 354.74035c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191l0 426.76678C354.608344 792.519951 363.549993 801.449321 374.562814 801.449321z"
                    p-id="2227"
                  ></path>
                  <path
                    d="M649.832182 801.449321c11.012821 0 19.954471-8.92937 19.954471-19.942191L669.786653 354.74035c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191l0 426.76678C629.877711 792.519951 638.81936 801.449321 649.832182 801.449321z"
                    p-id="2228"
                  ></path>
                </svg>
              </span>
            </template>
            <template slot="action" slot-scope="{ row, index }">
              <!-- 生产环境 -->
              <div v-if="isProduction">
                <span
                  v-if="checkFile(row.name) === 'video'"
                  class="play"
                  @click="playVideo(baseurl + 'd' + row.path, index)"
                >
                  <i
                    v-if="video.hash === hash && video.index === index"
                    aria-hidden="true"
                    class="fa fa-stop"
                    title="停止"
                  ></i>
                  <i
                    v-else
                    aria-hidden="true"
                    class="fa fa-play"
                    title="播放"
                  ></i>
                </span>
                <span
                  v-else-if="checkFile(row.name) === 'audio'"
                  class="play"
                  @click="playAudio(row.name)"
                >
                  <i
                    v-if="audio.hash === hash && audio.index === index"
                    aria-hidden="true"
                    class="fa fa-stop"
                    title="停止"
                  ></i>
                  <i
                    v-else
                    aria-hidden="true"
                    class="fa fa-play"
                    title="播放"
                  ></i>
                </span>
                <span
                  v-else-if="checkFile(row.name) === 'image'"
                  class="play"
                  title="预览"
                  @click="showImage(baseurl + 'd' + row.path, index)"
                >
                  <i aria-hidden="true" class="fa fa-eye"></i>
                </span>
                <span
                  v-else-if="
                    ['powerpoint', 'word', 'excel', 'pdf'].includes(
                      checkFile(row.name)
                    )
                  "
                  class="preview"
                  title="预览"
                  @click="preview(baseurl + 'd' + row.path, index)"
                >
                  <svg
                    class="icon"
                    height="15"
                    p-id="2988"
                    version="1.1"
                    viewBox="0 0 1024 1024"
                    width="15"
                    x="1648623167521"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M925.013333 68.266667l-290.133333-68.266667h-10.24L95.573333 204.8c-6.826667 3.413333-10.24 10.24-10.24 17.066667v546.133333c0 6.826667 3.413333 10.24 6.826667 13.653333s10.24 3.413333 17.066667 0l136.533333-68.266666c6.826667-3.413333 10.24-10.24 10.24-13.653334V269.653333l409.6-126.293333V887.466667L105.813333 819.2c-10.24 0-17.066667 3.413333-17.066666 13.653333-3.413333 10.24 3.413333 17.066667 10.24 20.48l546.133333 170.666667H655.36l273.066667-102.4c6.826667-3.413333 10.24-10.24 10.24-17.066667v-819.2c0-6.826667-6.826667-13.653333-13.653334-17.066666z"
                      fill=""
                      p-id="2989"
                    ></path>
                  </svg>
                </span>
                <i class="-dedent"></i>
              </div>
              <!-- 开发环境 -->
              <div v-else>
                <span
                  v-if="checkFile(row.name) === 'video'"
                  class="play"
                  @click="playVideo(baseurl + 'd' + row.path, index)"
                >
                  <i
                    v-if="video.hash === hash && video.index === index"
                    aria-hidden="true"
                    class="fa fa-stop"
                    title="停止"
                  ></i>
                  <i
                    v-else
                    aria-hidden="true"
                    class="fa fa-play"
                    title="播放"
                  ></i>
                </span>
                <span
                  v-else-if="checkFile(row.name) === 'audio'"
                  class="play"
                  @click="playAudio(row.name)"
                >
                  <i
                    v-if="audio.hash === hash && audio.index === index"
                    aria-hidden="true"
                    class="fa fa-stop"
                    title="停止"
                  ></i>
                  <i
                    v-else
                    aria-hidden="true"
                    class="fa fa-play"
                    title="播放"
                  ></i>
                </span>
                <span
                  v-else-if="checkFile(row.name) === 'image'"
                  class="play"
                  title="预览"
                  @click="showImage(baseurl + 'd' + row.path, index)"
                >
                  <i aria-hidden="true" class="fa fa-eye"></i>
                </span>
                <span
                  v-else-if="
                    ['powerpoint', 'word', 'excel', 'pdf'].includes(
                      checkFile(row.name)
                    )
                  "
                  class="preview"
                  title="预览"
                  @click="preview(baseurl + 'd' + row.path, index)"
                >
                  <svg
                    class="icon"
                    height="15"
                    p-id="2988"
                    version="1.1"
                    viewBox="0 0 1024 1024"
                    width="15"
                    x="1648623167521"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M925.013333 68.266667l-290.133333-68.266667h-10.24L95.573333 204.8c-6.826667 3.413333-10.24 10.24-10.24 17.066667v546.133333c0 6.826667 3.413333 10.24 6.826667 13.653333s10.24 3.413333 17.066667 0l136.533333-68.266666c6.826667-3.413333 10.24-10.24 10.24-13.653334V269.653333l409.6-126.293333V887.466667L105.813333 819.2c-10.24 0-17.066667 3.413333-17.066666 13.653333-3.413333 10.24 3.413333 17.066667 10.24 20.48l546.133333 170.666667H655.36l273.066667-102.4c6.826667-3.413333 10.24-10.24 10.24-17.066667v-819.2c0-6.826667-6.826667-13.653333-13.653334-17.066666z"
                      fill=""
                      p-id="2989"
                    ></path>
                  </svg>
                </span>
              </div>
            </template>
          </Table>
        </div>
        <Page
          v-if="page.total > page.page_size"
          :current="page.current"
          :page-size="page.page_size"
          :page-size-opts="[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]"
          :styles="{ 'text-align': 'right' }"
          :total="page.total"
          show-sizer
          @on-change="page_change"
          @on-page-size-change="page_size_change"
        ></Page>
      </div>
    </div>

    <div class="readme">
      <div class="card-header">
        <svg
          aria-hidden="true"
          class="octicon octicon-book"
          height="16"
          version="1.1"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"
            fill-rule="evenodd"
          ></path>
        </svg>
        <h3>README.md</h3>
      </div>
      <div class="markdown-body" v-html="readme"></div>
    </div>
    <!-- <My-DPlayer :video="video" ref="mydplayer" v-on:close="closePlayer" v-show="video.show"></My-DPlayer>  -->
    <D-Player
      v-show="video.show"
      ref="mydplayer"
      v-on:closeVideo="closeV"
    ></D-Player>
    <A-Player
      v-show="audio.show"
      ref="myaplayer"
      v-on:closeAudio="closeA"
    ></A-Player>

    <Modal v-model="modal" title="加密文件" @on-ok="ok" @on-cancel="cancel">
      <Input
        v-model="pass"
        placeholder="请输入密码"
        type="password"
        @keyup.enter.native="ok"
      />
      <p v-show="pass_count > 1" style="color: red">密码错误！</p>
    </Modal>
    <Modal v-model="img_modal" title="图片预览">
      <img :src="img_src" alt="" style="width: 100%; height: 100%" />
      <div slot="footer">
        <Button type="default" @click="pre_image">上一张</Button>
        <Button type="info" @click="next_image">下一张</Button>
      </div>
    </Modal>

    <M-Footer :version="site_config.version"></M-Footer>
  </div>
</template>

<script>
import axios from "axios";
import {
  DeleteFile,
  getAllFiles,
  getConfig,
  getReadme,
  logout,
  Mkdir,
  searchAll,
  UpdatePermission,
  Upload
} from "@/API/api";
import { checkFileType } from "../utils/index";
import DPlayer from "../components/Dplayer";
import APlayer from "../components/Aplayer";
import Footer from "../components/Footer";
import Vue from "vue";

let cancel;
let CancelToken;

function filterData(files, search_global, reg, keywords) {
  if (search_global) return files;
  return keywords
    ? files.filter(item => reg.test(item.name.toLowerCase()))
    : files;
}

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
          //desc 倒序 asc 顺序
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
          //desc 倒序升序 asc 顺序降序
          sortMethod: (a, b, type) => {
            if (type === "desc") {
              return a > b ? -1 : 1;
            } else return a > b ? 1 : -1;
          }
        },
        {
          title: " ",
          slot: "delete",
          width: 50,
          align: "center"
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
      current_files: [],
      path: [],
      keywords: "",
      search_global: false,
      search_ends: [],
      search_global_data: [],
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
      img_src: "",
      site_config: {
        load: false,
        name: "GONEList",
        page_title: "GONEList",
        upload: false,
        admin_permission: false,
        version: "v0.0.0"
      },
      page: {
        page_size: 50,
        current: 1,
        total: 0
      },
      // 当前 image 的下标
      current_image_index: 0
    };
  },
  mounted() {
    CancelToken = axios.CancelToken;
    window.onresize = () => {
      this.checkWidth();
    };
  },
  created() {
    this.checkWidth();
    this.init();
  },
  watch: {
    page: {
      handler: function(newValue) {
        console.log(newValue);
      },
      deep: true
    },
    $route: {
      handler: function() {
        this.init();
      },
      // 深度观察监听
      deep: true
    },
    path: {
      handler: function(newValue) {
        const cleanPaths = newValue.filter(i => i !== "/");
        if (cleanPaths.length) {
          const lastName = cleanPaths.slice(-1)[0];
          const cleanPath = "/" + cleanPaths.join("/");
          if (cleanPaths.length > 1) {
            document.title = `${lastName} - ${cleanPath} - ${this.site_config.page_title}`;
          } else {
            document.title = `${lastName} - ${this.site_config.page_title}`;
          }
        } else {
          document.title = this.site_config.page_title;
        }
      }
    }
  },
  filters: {
    formatTime(time) {
      return time.replace(/[T,Z]/g, "  ");
    },
    formatSize(size) {
      let result;
      // size 为字节
      if (size / 1024 / 1024 / 1024 >= 1) {
        // 可以转化为 GB 就转化为 GB
        result = (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
      } else if (size / 1024 / 1024 >= 1) {
        // 可以转化为 MB 就转化为 MB
        result = (size / 1024 / 1024).toFixed(2) + "MB";
      } else {
        // 否则转化为 KB
        result = (size / 1024).toFixed(2) + "KB";
      }
      return result;
    },
    filterData(files, search_global, reg, keywords) {
      return filterData(files, search_global, reg, keywords);
    }
  },
  methods: {
    page_size_change(page_size) {
      this.page.page_size = page_size;
      this.init();
    },
    page_change(page) {
      console.log(page);
      this.page.current = page;
      this.current_files = this.files.slice(
        (page - 1) * this.page.page_size,
        page * this.page.page_size
      );
    },
    pre_image() {
      for (let i = this.current_image_index - 1; i >= 0; i--) {
        if (checkFileType(this.files[i].name) === "image") {
          this.img_src = this.baseurl + "d" + this.files[i].path;
          this.current_image_index = i;
          return;
        }
      }
      Vue.prototype.$Message.error("已是第一张图片");
    },
    next_image() {
      for (let i = this.current_image_index + 1; i <= this.files.length; i++) {
        if (checkFileType(this.files[i].name) === "image") {
          this.img_src = this.baseurl + "d" + this.files[i].path;
          this.current_image_index = i;
          return;
        }
      }
      Vue.prototype.$Message.error("已是最后一张图片");
    },
    preview(path) {
      window.open("https://view.officeapps.live.com/op/view.aspx?src=" + path);
    },
    update_permission() {
      let secret = "";
      secret = window.sessionStorage.getItem("gonelist_secret");
      if (secret === null) {
        secret = window.prompt("请输入你的上传密钥：", "");
        if (secret === "") return;
      }
      UpdatePermission(this.baseurl, secret).then(resp => {
        if (resp.code === 200) {
          this.site_config.admin_permission = true;
          window.sessionStorage.setItem("gonelist_secret", secret);
        } else {
          this.$Message.error("token 鉴权失败");
          window.sessionStorage.removeItem("gonelist_secret");
        }
      });
    },
    delete_file(path, file_name) {
      let b = window.confirm("确认删除该文件吗？\n" + file_name);
      if (!b) return;
      DeleteFile(
        this.baseurl,
        path,
        sessionStorage.getItem("gonelist_secret")
      ).then(resp => {
        if (resp.code === 200) {
          this.$Message.info("文件删除成功");
          this.init();
        }
      });
    },
    mkdir() {
      let param = decodeURIComponent(window.location.hash);
      if (param[param.length - 1] === "/") {
        param = param.slice(1, -1);
      } else {
        param = param.slice(1);
      }
      let folder_name = window.prompt("请输入文件名：", "");
      if (folder_name === "") return;
      Mkdir(
        this.baseurl,
        param,
        folder_name,
        sessionStorage.getItem("gonelist_secret")
      ).then(resp => {
        if (resp.code === 200) {
          this.$Message.info("文件夹创建成功");
          this.init();
        }
      });
    },
    // 文件上传
    upload() {
      let secret = window.localStorage.getItem("gonelist_secret");
      if (!secret) {
        secret = window.prompt("请输入你的上传密钥：", "");
        if (!secret) {
          return;
        }
        window.localStorage.setItem("gonelist_secret", secret);
      }
      let tempDom = document.createElement("input");
      tempDom.value = "选择文件";
      tempDom.type = "file";
      tempDom.onchange = e => {
        let param = decodeURIComponent(window.location.hash);
        if (param[param.length - 1] === "/") {
          param = param.slice(1, -1);
        } else {
          param = param.slice(1);
        }
        console.log(e.target.files[0]);
        // if (e.target.files[0].size >= 4194304) {
        //   this.$Message.error("当前仅支持文件小于 4Mb");
        //   return;
        // }
        let body = new FormData();
        body.append("file", e.target.files[0]);
        Upload(
          this.baseURL,
          param,
          body,
          this.pass,
          e.target.files[0].name,
          secret
        ).then(res => {
          // 判断是否 secret 错误
          if (res.code === 10009) {
            this.$Message.error(" upload secret 错误");
            // 如果判断 secret 错误就将存起来的 secret 删掉
            window.localStorage.removeItem("gonelist_secret");
          } else if (res.code === 200) {
            this.init();
          }
          // this.init();
        });
      };
      tempDom.click();
    },
    loadConfig() {
      if (!this.site_config.load) {
        getConfig(this.baseurl)
          .then(response => {
            if (response.code === 200) {
              const data = response.data;
              this.site_config = Object.assign(this.site_config, data, {
                load: true
              });
              document.title = this.site_config.page_title;
              console.log(this.site_config);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    init() {
      this.keywords = "";
      this.hash = decodeURIComponent(window.location.hash);
      // hash 为空或者 hash 为#/都认为 hash 为#/
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
      console.log("格式化后的 hash：", this.hash);
      // 通过 search 来查找对应的文件夹，需要 decodeURI 一下
      this.path = this.hash.slice(1).split("/");
      // 将最后的空元素删除
      // 如果最后一个元素是 "" 就删
      if (this.path[this.path.length - 1] === "") {
        console.log("pop 掉最后一个");
        this.path.pop();
      }
      // 将hash置为/
      if (this.path[0] === "") {
        this.path[0] = "/";
      }
      console.log("path 数组：", this.path);
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
          this.page.total = this.files.length;
          if (this.files.length > this.page.page_size) {
            this.current_files = this.files.slice(0, this.page.page_size);
          } else {
            this.current_files = this.files;
          }
          // console.log(this.files.children);
          // this.files.chirden = [];
          // this.files.children.push(...this.files);
          // if (!this.files.children) {
          //   this.files.children = [];
          // } else {
          //   // 如果匹配到文件夹就直接下载
          //   if (!this.files.is_folder) {
          //     this.files.children = [];
          //     this.files.children.push(this.files);
          //     console.log("下载", this.files.download_url);
          //     //window.open(this.files.download_url, "_blank")
          //     // window.location.href = this.files.download_url;
          //   }
          // }
        }
      });
      getReadme(this.baseURL, param, this.pass).then(res => {
        this.readme = res.data;
        //console.log(this.readme)
      });
      this.loadConfig();
    },
    nextFile(index, name) {
      // console.log(name);
      // if (this.path.length === 1) {
      //   this.hash = this.hash + name;
      // } else {
      //   this.hash = this.hash + "/" + name;
      // }
      console.log("path ==>" + this.path);
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
    search_global_fun() {
      if (cancel) {
        cancel("cancel_request_error");
      }

      const cancel_token = new CancelToken(function executor(c) {
        cancel = c;
      });

      if (this.keywords.length === 0) {
        return;
      }

      searchAll(this.baseurl, this.keywords, cancel_token)
        .then(response => {
          this.search_ends = response.data;
        })
        .catch(thrown => {
          if (!axios.isCancel(thrown)) {
            this.$Message.error("[SGE] 请求错误，请检查后端");
          }
        });
    },
    search() {
      if (this.search_global) {
        this.search_global_fun();
      } else {
        this.reg = new RegExp(this.keywords.toLowerCase());
      }
    },
    redirectSearch(end) {
      const paths = end.split("/");
      paths.pop();
      const path = paths.join("/");
      location.href = location.origin + "#" + path.replaceAll("//", "/");
      // window.open(location.origin + "#" + path.replaceAll("//", "/")+'?time='+(new Date()).getTime(),'_self');
      // location.href = location.origin + "#" + path.replaceAll("//", "/") + '?time='+((new Date()).getTime());
      // window.location.href = loca+'?time='+((new Date()).getTime());
    },
    switchSearchGlobal(status) {
      this.search_global = status;
    },
    exit() {
      logout(this.baseURL).then(() => {
        window.location.hash = "";
      });
    },
    playVideo(playUrl, index) {
      console.log(playUrl);
      let video = {
        playUrl: playUrl,
        name: this.files[index].name
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
    playAudio(name) {
      if (!this.audio.show) {
        this.audio.show = true;
        this.$refs.myaplayer.init();
      }

      const playlist = this.getFileListByType("audio");
      this.$refs.myaplayer.updateList(playlist);
      setTimeout(() => {
        const index = playlist.findIndex(item => item.raw.name === name);
        this.$refs.myaplayer.play(index + 1);
      }, 20);
    },
    getFileListByType(type) {
      const list = filterData(
        this.current_files,
        this.search_global,
        this.reg,
        this.keywords
      );
      const playerList = list.filter(item => checkFileType(item.name) === type);
      return playerList.map(item => {
        return {
          url: this.baseurl + "d" + item.path,
          artist: item.name.split("-")[0],
          name: item.name.split("-")[1],
          fullName: item.name,
          raw: item
        };
      });
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
      this.current_image_index = _index;
    },
    checkWidth() {
      this.clientHeight = `${document.documentElement.clientWidth}`;
      //console.log(this.clientHeight);
      if (this.clientHeight < 801) {
        this.header = this.headerCopy.filter(item => item.title !== "时间");
      } else {
        this.header = this.headerCopy.map(item => {
          if (item.slot === "name") {
            item.minWidth = 400;
          } else if (item.slot === "last_modify_time") {
            item.width = 200;
          } else if (item.slot === "size") {
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
